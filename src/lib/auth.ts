import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" } 
      },
      async authorize(credentials, req) {
        await connectDB();
        
        if (!credentials?.email) return null;

        // Check if user exists
        let user = await User.findOne({ email: credentials.email });

        // Since we are mocking registration in the UI, we'll auto-create the user here 
        // if they don't exist, to ensure persistence works for the user.
        if (!user && credentials?.password) {
            user = await User.create({
                email: credentials.email,
                name: credentials.email.split('@')[0],
                password: credentials.password, // In prod, hash this!
                role: credentials.role || 'student'
            });
        }

        if (user) {
           return {
             id: user._id.toString(),
             name: user.name,
             email: user.email,
             role: user.role,
             leetcode: user.leetcode,
             codeforces: user.codeforces,
             hackerrank: user.hackerrank
           }
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
        if (user) {
           // If user object is present, it means it's a fresh sign-in.
           // For Credentials, 'user' is the object returned from authorize() which already has DB data.
           // For Google, 'user' is just { name, email, image } from Google. We need to fetch/create in DB.

           if (!token.leetcode) { // If leetcode is missing (likely Google Login)
              try {
                  await connectDB();
                  let dbUser = await User.findOne({ email: user.email });
                  
                  if (!dbUser && user.email) {
                      // Auto-create user for Google Login
                      dbUser = await User.create({
                          email: user.email,
                          name: user.name || user.email.split('@')[0],
                          role: 'student'
                      });
                  }

                  if (dbUser) {
                      token.id = dbUser._id.toString();
                      token.role = dbUser.role;
                      token.leetcode = dbUser.leetcode;
                      token.codeforces = dbUser.codeforces;
                      token.hackerrank = dbUser.hackerrank;
                  }
              } catch (e) {
                  console.error("Error syncing Google user with DB:", e);
              }
           } else {
               // Credentials login already populated it
               token.role = (user as any).role;
               token.leetcode = (user as any).leetcode;
           }
        }
        
        if (trigger === "update") {
            if (session?.leetcode) {
                token.leetcode = session.leetcode;
                // Also update DB when session is updated via client
                await connectDB();
                if (token.email) {
                    await User.findOneAndUpdate(
                        { email: token.email },
                        { leetcode: session.leetcode }
                    );
                }
            }
            if (session?.codeforces) token.codeforces = session.codeforces;
            if (session?.hackerrank) token.hackerrank = session.hackerrank;
        }
        return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).leetcode = token.leetcode;
        (session.user as any).codeforces = token.codeforces;
        (session.user as any).hackerrank = token.hackerrank;
      }
      return session;
    },
  },
};
