import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        mobile: { label: "Mobile", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        const user = await User.findOne({ mobile: credentials.mobile });
        if (!user) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        
        return { 
          id: user._id, 
          name: `${user.firstName} ${user.lastName}`,
          email: user.mobile,
          image: user.image || null 
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    }
  }
}

export default NextAuth(authOptions)