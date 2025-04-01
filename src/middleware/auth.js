import jwt from "jsonwebtoken";

// Middleware för autentisering
export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token)
      return res.status(401).json({ error: "Access denied, no token" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "invalid token" });
  }
};

// Middleware för admin-autentisering
export const adminAuth = async (req, res, next) => {
  await auth(req, res, async () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Only admin has access" });
    }
    next();
  });
};
