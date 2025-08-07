import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import { comparePassword } from '@/lib/passwordUtils'
const baseUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : process.env.NEXTAUTH_URL;
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
            mobile: user.mobile,
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
  cookies: {
    callbackUrl: {
      name: `${baseUrl ? new URL(baseUrl).hostname : '__Secure-next-auth.callback-url'}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }}},
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect to signin on error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mobile = user.mobile;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
   async session({ session, token }) {
      // Fetch fresh user data from DB
      await dbConnect();
      const dbUser = await User.findById(token.id)
        .select('firstName lastName mobile image likedProperties');
      
      if (!dbUser) return session;
      
      // Populate session with fresh data
      session.user = {
        id: dbUser._id.toString(),
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        mobile: dbUser.mobile,
        image: dbUser.image,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        likedProperties: dbUser.likedProperties.map(id => id.toString())
      };
      
      return session;
    }
  
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions);