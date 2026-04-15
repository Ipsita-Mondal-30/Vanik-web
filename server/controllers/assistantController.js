import { GoogleGenerativeAI } from "@google/generative-ai";
import { KbChunk } from "../models/KbChunk.js";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("Missing GEMINI_API_KEY in server environment");
    err.statusCode = 500;
    throw err;
  }
  return new GoogleGenerativeAI(apiKey);
}

function chunkText(text, { chunkSize = 900, overlap = 150 } = {}) {
  const clean = String(text || "").replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    const end = Math.min(clean.length, start + chunkSize);
    const piece = clean.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= clean.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length && i < b.length; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}

function requireString(value, field) {
  if (!value || typeof value !== "string" || !value.trim()) {
    const err = new Error(`${field} is required`);
    err.statusCode = 400;
    throw err;
  }
  return value.trim();
}

function parseRoles(input) {
  if (!input) return [];
  const roles = Array.isArray(input) ? input : [input];
  const normalized = roles
    .filter(Boolean)
    .map((r) => String(r).trim().toLowerCase())
    .filter((r) => r === "farmer" || r === "buyer");
  return Array.from(new Set(normalized));
}

function normalizeEmbeddingModel(model) {
  const m = String(model || "").trim();
  if (!m) return "gemini-embedding-001";
  // `text-embedding-004` is deprecated/unsupported for many SDK versions.
  if (m === "text-embedding-004" || m === "text-embedding-003") {
    return "gemini-embedding-001";
  }
  return m;
}

function normalizeChatModel(model) {
  const m = String(model || "").trim();
  if (!m) return "gemini-2.5-flash";
  // Common legacy names that may 404 depending on API/key/SDK.
  if (m === "gemini-1.5-flash" || m === "gemini-pro") {
    return "gemini-2.5-flash";
  }
  if (m === "gemini-2.0-flash") {
    return "gemini-2.5-flash";
  }
  return m;
}

let cachedModelList = null;
let cachedModelListAt = 0;
let cachedDefaultChatModel = null;
let cachedDefaultChatModelAt = 0;

async function listGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("Missing GEMINI_API_KEY in server environment");
    err.statusCode = 500;
    throw err;
  }

  const now = Date.now();
  if (cachedModelList && now - cachedModelListAt < 10 * 60 * 1000) {
    return cachedModelList;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
    apiKey,
  )}`;
  const resp = await fetch(url, { method: "GET" });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(
      json?.error?.message || `Failed to list models (HTTP ${resp.status})`,
    );
    err.statusCode = resp.status;
    throw err;
  }

  cachedModelList = Array.isArray(json.models) ? json.models : [];
  cachedModelListAt = now;
  return cachedModelList;
}

function pickDefaultChatModelFromList(models) {
  // Prefer a low-cost fast model, then any gemini model that supports generateContent.
  const preferred = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-pro",
    "gemini-1.5-flash",
  ];

  const supportsGenerate = (m) =>
    Array.isArray(m.supportedGenerationMethods) &&
    m.supportedGenerationMethods.includes("generateContent");

  const nameOf = (m) => String(m.name || "").replace(/^models\//, "");

  for (const p of preferred) {
    const found = models.find((m) => nameOf(m) === p && supportsGenerate(m));
    if (found) return nameOf(found);
  }

  const anyGemini = models.find(
    (m) => nameOf(m).startsWith("gemini") && supportsGenerate(m),
  );
  return anyGemini ? nameOf(anyGemini) : null;
}

async function getWorkingChatModel() {
  const now = Date.now();
  if (
    cachedDefaultChatModel &&
    now - cachedDefaultChatModelAt < 30 * 60 * 1000
  ) {
    return cachedDefaultChatModel;
  }

  const models = await listGeminiModels();
  const picked = pickDefaultChatModelFromList(models);
  if (picked) {
    cachedDefaultChatModel = picked;
    cachedDefaultChatModelAt = now;
    return picked;
  }
  return normalizeChatModel(process.env.GEMINI_CHAT_MODEL);
}

export async function listAssistantModels(req, res) {
  try {
    const models = await listGeminiModels();
    const summarized = models.map((m) => ({
      name: String(m.name || "").replace(/^models\//, ""),
      supportedGenerationMethods: m.supportedGenerationMethods || [],
      displayName: m.displayName || "",
    }));
    return res.json({
      models: summarized,
      suggestedChatModel: pickDefaultChatModelFromList(models),
      suggestedEmbeddingModel: "gemini-embedding-001",
    });
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    console.error("listAssistantModels error:", err);
    return res.status(status).json({ message: err.message || "Failed to list models" });
  }
}

export async function ingestDocument(req, res) {
  try {
    const title = String(req.body?.title || "").trim();
    const source = String(req.body?.source || "").trim();
    const visibility = String(req.body?.visibility || "private").trim();
    const roles = parseRoles(req.body?.roles);
    const text = requireString(req.body?.text, "text");

    if (!["public", "private"].includes(visibility)) {
      return res
        .status(400)
        .json({ message: 'visibility must be "public" or "private"' });
    }

    const chunks = chunkText(text);
    if (chunks.length === 0) {
      return res.status(400).json({ message: "No content to ingest" });
    }
    if (chunks.length > 120) {
      return res.status(400).json({
        message:
          "Document too large for simple ingest. Please ingest smaller documents.",
      });
    }

    const client = getGeminiClient();
    const embeddingModel = normalizeEmbeddingModel(
      process.env.GEMINI_EMBEDDING_MODEL,
    );
    const embedder = client.getGenerativeModel({ model: embeddingModel });

    const embeddings = await Promise.all(
      chunks.map(async (content) => {
        const r = await embedder.embedContent(content);
        return r.embedding.values;
      }),
    );

    const toInsert = chunks.map((chunk, idx) => ({
      text: chunk,
      embedding: embeddings[idx],
      title,
      source,
      visibility,
      roles,
      createdBy: req.user.userId,
      createdAt: new Date(),
    }));

    const inserted = await KbChunk.insertMany(toInsert);

    return res.status(201).json({
      ok: true,
      chunksInserted: inserted.length,
    });
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    console.error("ingestDocument error:", err);
    return res.status(status).json({
      message: err.message || "Failed to ingest document",
    });
  }
}

export async function askAssistant(req, res) {
  try {
    const query = requireString(req.body?.query, "query");
    const topK = Math.max(1, Math.min(8, Number(req.body?.topK || 5)));

    const client = getGeminiClient();
    const embeddingModel = normalizeEmbeddingModel(
      process.env.GEMINI_EMBEDDING_MODEL,
    );
    const qEmbed = await client
      .getGenerativeModel({ model: embeddingModel })
      .embedContent(query);
    const queryVec = qEmbed.embedding.values;

    const role = req.user.role;
    const userId = req.user.userId;

    // Simple + safe filtering:
    // - Always include public docs
    // - Include private docs only if createdBy is the current user
    // - If a chunk has roles specified, it must include the user's role
    const candidates = await KbChunk.find({
      $and: [
        { $or: [{ visibility: "public" }, { createdBy: userId }] },
        {
          $or: [{ roles: { $size: 0 } }, { roles: role }],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(300)
      .lean();

    const scored = candidates
      .filter((c) => Array.isArray(c.embedding) && c.embedding.length === queryVec.length)
      .map((c) => ({
        ...c,
        score: cosineSimilarity(queryVec, c.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    const contextBlocks = scored.map((c, idx) => {
      const label = c.title?.trim()
        ? c.title.trim()
        : c.source?.trim()
          ? c.source.trim()
          : `source_${idx + 1}`;
      return `SOURCE ${idx + 1} [${label}]\n${c.text}`;
    });

    const system = `You are Vanik's assistant for a farmer/buyer marketplace.
Answer the user's question using ONLY the provided sources when possible.
If the sources do not contain enough info, say what is missing and ask one clarifying question.
When you use a source, cite it inline like [1] or [2].`;

    const userMsg =
      contextBlocks.length > 0
        ? `Question: ${query}\n\nSources:\n\n${contextBlocks.join("\n\n")}`
        : `Question: ${query}\n\nNo sources were retrieved.`;

    let result;
    let usedModel = null;
    try {
      const configured = normalizeChatModel(process.env.GEMINI_CHAT_MODEL);
      usedModel = configured;
      const model = client.getGenerativeModel({ model: configured });
      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${system}\n\n${userMsg}` }],
          },
        ],
        generationConfig: { temperature: 0.2 },
      });
    } catch (e) {
      const msg = String(e?.message || "");
      const is404 = e?.status === 404 || msg.includes("[404");
      if (!is404) throw e;

      // Auto-pick a working model for this API key.
      const fallback = await getWorkingChatModel();
      usedModel = fallback;
      const model = client.getGenerativeModel({ model: fallback });
      result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${system}\n\n${userMsg}` }],
          },
        ],
        generationConfig: { temperature: 0.2 },
      });
    }
    const answer = result.response?.text?.() || "";

    return res.json({
      answer,
      model: usedModel,
      sources: scored.map((c, idx) => ({
        index: idx + 1,
        id: c._id.toString(),
        title: c.title || "",
        source: c.source || "",
        visibility: c.visibility,
        score: Number(c.score.toFixed(4)),
      })),
    });
  } catch (err) {
    const status = err.statusCode || err.status || 500;
    console.error("askAssistant error:", err);
    return res.status(status).json({
      message: err.message || "Failed to answer",
    });
  }
}

