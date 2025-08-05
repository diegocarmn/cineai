import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/prisma/prisma"; // ajusta se o path for diferente

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const email = profile.email;

        // Verifica se já existe user no banco
        let user = await prisma.user.findUnique({ where: { email } });

        // Se não existir, cria
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.name ?? "",
              image: profile.picture ?? "",
            },
          });
        }

        token.sub = user.id; // usa o ID real do Prisma no token
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/home`;
    },
  },
});

export { handlers as GET, handlers as POST };
