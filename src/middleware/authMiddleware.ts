import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; role: "Admin" | "Participant" };
}

export const authMiddleware = (roles?: ("Admin" | "Participant")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
        role: "Admin" | "Participant";
      };

      // If specific roles are required, check
      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
