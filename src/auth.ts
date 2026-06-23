import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

// ─── Validation schema for login ──────────────────────────────────
const credentialsSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

// ─── Dev credentials (Phase 7: replace with Prisma lookup) ───────
const DEV_USERS = [
  {
    id:    "admin-1",
    name:  "Administrador",
    email: "admin@elitepropiedades.com",
    password: "Admin@1234!",
    role: "SUPER_ADMIN",
  },
  {
    id:    "agent-1",
    name:  "Alejandro García",
    email: "alejandro@elitepropiedades.com",
    password: "Agente@1234!",
    role: "AGENTE",
  },
] as const;

// ─── NextAuth v5 config ───────────────────────────────────────────
export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",      type: "email"    },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Phase 7: db.user.findUnique({ where: { email } }) + bcrypt.compare
        const user = DEV_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) return null;

        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role as string;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id   = token.id   as string;
      session.user.role = token.role as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  session: { strategy: "jwt" },

  // Required in production: set AUTH_SECRET in .env
  trustHost: true,
});
