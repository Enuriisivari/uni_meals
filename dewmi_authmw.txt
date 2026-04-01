import { getUserById } from "../services/authService.js";
import { verifyAuthToken } from "../utils/token.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authorization.slice(7);
    const payload = verifyAuthToken(token);
    const user = await getUserById(payload.sub);

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
