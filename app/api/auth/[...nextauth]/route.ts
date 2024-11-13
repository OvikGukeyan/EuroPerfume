import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from "@/prisma/prisma-client";
import { compare } from "bcrypt";

const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findFirst({
          where: values
        })

        if (!findUser) return null;

        const isPasswordValid = await compare(credentials.password, findUser.password);

        if (!isPasswordValid) return null;

        if (!findUser.verified) return null;

        return {
          id: String(findUser.id),
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        }
      }

    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };




