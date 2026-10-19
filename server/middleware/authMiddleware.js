import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return "dev-only-insecure-secret";
  }
  return secret;
}

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = header.slice(7).trim();
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const userId = payload.userId;
    const role = payload.role;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { userId, role };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
