import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn(
      "JWT_SECRET is not set; using insecure dev default. Set JWT_SECRET in .env for production.",
    );
    return "dev-only-insecure-secret";
  }
  return secret;
}

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

function validateSignupBody(body) {
  const errors = [];
  const { name, email, password, role } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Name is required");
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Email must be valid");
  }
  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (!role || !["farmer", "buyer"].includes(role)) {
    errors.push('Role must be "farmer" or "buyer"');
  }
  return errors;
}

function validateLoginBody(body) {
  const errors = [];
  const { email, password } = body;

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Email is required");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Email must be valid");
  }
  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  }
  return errors;
}

function userResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function signup(req, res) {
  try {
    const errors = validateSignupBody(req.body);
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const { name, email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: userResponse(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
}

export async function login(req, res) {
  try {
    const errors = validateLoginBody(req.body);
    if (errors.length) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: userResponse(user),
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
}
