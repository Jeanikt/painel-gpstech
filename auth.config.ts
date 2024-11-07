import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const user = {
          id: '1',
          name: 'John',
          email: credentials?.email as string
        };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  callbacks: {
    // Callback de signIn para validar os usuários do GitHub
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        console.log('GitHub User Login:', profile?.login);
        // Verificar se o login do usuário no GitHub corresponde ao permitido (Jeanikt)
        if (profile?.login === 'Jeanikt') {
          return true; // Permitir login apenas para o usuário 'Jeanikt'
        } else {
          return false; // Rejeitar login para qualquer outro usuário
        }
      }
      return false; // Rejeitar login se o provedor não for GitHub
    }
  },
  pages: {
    signIn: '/' //sigin page
  }
} satisfies NextAuthConfig;

export default authConfig;
