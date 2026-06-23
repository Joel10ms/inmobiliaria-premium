import type { DefaultSession, DefaultUser } from "next-auth";

// Extend the built-in session/user types to include role and id
declare module "next-auth" {
  interface Session {
    user: {
      id:   string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?:   string;
    role?: string;
  }
}
