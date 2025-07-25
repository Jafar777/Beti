import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import { comparePassword } from '@/lib/passwordUtils'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        mobile: { label: "Mobile", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          
          const trimmedMobile = credentials.mobile.trim();
          console.log(`Attempting login for mobile: ${trimmedMobile}`);
          
          const user = await User.findOne({ mobile: trimmedMobile })
            .select('+password +likedProperties');
          
          if (!user) {
            console.log('User not found');
            return null;
          }
          
          console.log(`User found: ${user._id}`);
          
          // Use our utility for password comparison
          const isValid = await comparePassword(credentials.password, user.password);
          
          if (!isValid) {
            console.log('Password mismatch');
            return null;
          }
          
          console.log('Login successful');
          
          // FIX: Handle undefined likedProperties
          const likedProperties = user.likedProperties || [];
          
          return { 
            id: user._id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.mobile,
            image: user.image || null,
            likedProperties: likedProperties.map(id => id.toString())
          }
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect to signin on error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          likedProperties: user.likedProperties
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstName = token.user?.name?.split(' ')[0] || '';
      session.user.lastName = token.user?.name?.split(' ')[1] || '';
      
      // FIX: Ensure likedProperties is always an array
      session.user.likedProperties = token.user?.likedProperties || [];
      
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions);