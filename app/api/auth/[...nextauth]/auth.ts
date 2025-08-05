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
      // Apenas na primeira vez: salvar dados do perfil
      if (account && profile?.email) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name ?? "",
              image: profile.picture ?? "",
            },
          });
        }

        token.sub = user.id;
      }

      // Aqui garantimos que sempre o token.sub vem do banco
      if (token.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (user) {
          token.sub = user.id;
        }
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
