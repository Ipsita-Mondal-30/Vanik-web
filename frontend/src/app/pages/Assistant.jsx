import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Sparkles, Upload, Search } from "lucide-react";
import api from "../api";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function Assistant() {
  const navigate = useNavigate();
  const { user } = useApp();

  const [asking, setAsking] = useState(false);
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const [ingesting, setIngesting] = useState(false);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [roles, setRoles] = useState({ farmer: true, buyer: true });
  const [text, setText] = useState("");

  const roleList = useMemo(() => {
    const out = [];
    if (roles.farmer) out.push("farmer");
    if (roles.buyer) out.push("buyer");
    return out;
  }, [roles]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const onAsk = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setAsking(true);
    try {
      const { data } = await api.post("/api/assistant/ask", {
        query: q,
        topK,
      });
      setAnswer(data.answer || "");
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch (err) {
      setAnswer("");
      setSources([]);
      toast.error(err.response?.data?.message || "Failed to get answer");
    } finally {
      setAsking(false);
    }
  };

  const onIngest = async (e) => {
    e.preventDefault();
    const bodyText = text.trim();
    if (!bodyText) return;

    setIngesting(true);
    try {
      const { data } = await api.post("/api/assistant/ingest", {
        title: title.trim(),
        source: source.trim(),
        visibility,
        roles: roleList,
        text: bodyText,
      });
      toast.success(`Ingested ${data.chunksInserted || 0} chunks`);
      setText("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to ingest document");
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 rounded-full p-3">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Assistant</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Ask questions with citations, or ingest knowledge.
            </p>
          </div>
        </div>

        <Tabs defaultValue="ask" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="ask" className="gap-2">
              <Search className="w-4 h-4" />
              Ask
            </TabsTrigger>
            <TabsTrigger value="ingest" className="gap-2">
              <Upload className="w-4 h-4" />
              Ingest
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ask" className="mt-4">
            <Card className="shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={onAsk} className="space-y-3">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask something…"
                    className="min-h-[110px]"
                    disabled={asking}
                  />
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Top K
                      </span>
                      <Input
                        type="number"
                        min={1}
                        max={8}
                        value={topK}
                        onChange={(e) =>
                          setTopK(
                            Math.max(
                              1,
                              Math.min(8, Number(e.target.value || 5)),
                            ),
                          )
                        }
                        className="w-24"
                        disabled={asking}
                      />
                    </div>
                    <Button type="submit" disabled={asking}>
                      {asking ? "Asking…" : "Ask"}
                    </Button>
                  </div>
                </form>

                {(answer || sources.length > 0) && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <h2 className="text-base font-semibold mb-2">Answer</h2>
                      <div className="rounded-lg border bg-background p-4 whitespace-pre-wrap">
                        {answer || "No answer returned."}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold mb-2">
                        Sources
                      </h3>
                      {sources.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No sources retrieved.
                        </p>
                      ) : (
                        <div className="grid gap-3">
                          {sources.map((s) => (
                            <div
                              key={s.id}
                              className="rounded-lg border bg-background p-4"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">[{s.index}]</Badge>
                                <span className="font-medium">
                                  {s.title || s.source || "Untitled"}
                                </span>
                                <Badge variant="outline">
                                  score {s.score}
                                </Badge>
                                <Badge variant="outline">{s.visibility}</Badge>
                              </div>
                              {(s.source || s.title) && (
                                <p className="text-xs text-muted-foreground mt-2 break-all">
                                  {s.source}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ingest" className="mt-4">
            <Card className="shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={onIngest} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Bidding policy"
                        disabled={ingesting}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Source</label>
                      <Input
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g. policy:bidding"
                        disabled={ingesting}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Visibility
                      </label>
                      <Select
                        value={visibility}
                        onValueChange={setVisibility}
                        disabled={ingesting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">private</SelectItem>
                          <SelectItem value="public">public</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Roles</label>
                      <div className="flex items-center gap-5 rounded-md border p-3 bg-background">
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={roles.farmer}
                            onCheckedChange={(v) =>
                              setRoles((prev) => ({
                                ...prev,
                                farmer: Boolean(v),
                              }))
                            }
                            disabled={ingesting}
                          />
                          farmer
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={roles.buyer}
                            onCheckedChange={(v) =>
                              setRoles((prev) => ({
                                ...prev,
                                buyer: Boolean(v),
                              }))
                            }
                            disabled={ingesting}
                          />
                          buyer
                        </label>
                        <span className="text-xs text-muted-foreground">
                          (leave both unchecked for all)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Text</label>
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your document here…"
                      className="min-h-[220px]"
                      disabled={ingesting}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={ingesting}>
                      {ingesting ? "Ingesting…" : "Ingest"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

