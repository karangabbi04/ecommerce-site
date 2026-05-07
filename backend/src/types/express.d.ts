import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string | null;
        email: string;
        role: Role;
        emailVerified: boolean;
        createdAt: Date;
      };
    }
  }
}

export {};