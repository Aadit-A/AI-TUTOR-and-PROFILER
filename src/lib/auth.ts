import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTokenUserQuery(token: any) {
  const id = typeof token?.id === "string" ? token.id : undefined;
  const email = typeof token?.email === "string" ? token.email : undefined;

  if (id && mongoose.Types.ObjectId.isValid(id)) {
    return { _id: id };
  }

  if (email) {
    return { email: { $regex: `^${escapeRegex(email)}$`, $options: "i" } };
  }

  return null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
             googleId: user.googleId,
             hasPassword: !!user.password
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
        if (trigger === "update" && session) {
            await connectDB();
            
            // Refresh user data functionality
        if (session.action === 'refresh') {
                const refreshQuery = getTokenUserQuery(token);
          const dbUser = refreshQuery ? await User.findOne(refreshQuery) : null;
                if (dbUser) {
                    token.id = dbUser._id.toString();
            token.email = dbUser.email;
                    token.role = dbUser.role;
                    token.leetcode = dbUser.leetcode;
                    token.googleId = dbUser.googleId;
                    token.hasPassword = !!dbUser.password;
                }
                return token;
            }

            const setFields: any = {};
            const unsetFields: any = {};
            
            // Handle linking (truthy) and unlinking (null)
            ['leetcode'].forEach(platform => {
                if (platform in session) {
                    const value = (session as any)[platform];
                    if (value) {
                        (token as any)[platform] = value;
                        setFields[platform] = value;
                    } else {
                        (token as any)[platform] = undefined;
                        unsetFields[platform] = 1;
                    }
                }
            });

            // Handle Google Unlink specifically
            if (session.unlinkGoogle) {
                unsetFields.googleId = 1;
                delete token.googleId;
            }
            
            // Apply updates to database
            const updateQuery = getTokenUserQuery(token);
            if (updateQuery) {
                const dbUpdate: any = {};
                if (Object.keys(setFields).length > 0) dbUpdate.$set = setFields;
                if (Object.keys(unsetFields).length > 0) dbUpdate.$unset = unsetFields;
                if (Object.keys(dbUpdate).length > 0) {
                await User.findOneAndUpdate(updateQuery, dbUpdate);
                }
            }
            return token;
        }

        if (user) {
           console.log("JWT Callback: user object present", JSON.stringify(user, null, 2));
           await connectDB();
            
           // Case 1: Credentials Login (user has role/id populated from authorize)
           if ((user as any).role) {
                console.log("JWT Callback: Processing Credentials Login");
                token.id = (user as any).id;
             token.email = (user as any).email;
                token.role = (user as any).role;
                token.leetcode = (user as any).leetcode;
                token.googleId = (user as any).googleId;
                token.hasPassword = (user as any).hasPassword;
           } 
           // Case 2: Google Login (user is profile from Google)
           else {
               console.log("JWT Callback: Processing Google Login", user.email);
               let dbUser = await User.findOne({ email: user.email });
               
               if (dbUser) {
                   console.log("JWT Callback: Found DB User", dbUser._id);
                   // If DB user doesn't have googleId, link it!
                   // This covers both "Login with Google to existing email" AND "Link Google while logged in"
                   console.log("JWT Callback: dbUser.googleId:", dbUser.googleId, "user.id:", user.id);
                   if (!dbUser.googleId && user.id) {
                        console.log("JWT Callback: Linking Google Account...");
                        dbUser.googleId = user.id; 
                        await dbUser.save();
                        console.log("JWT Callback: Linked successfully.");
                   }
               } else if (user.email) {
                   console.log("JWT Callback: Creating new user from Google");
                   // Create new user (Sign Up via Google)
                   dbUser = await User.create({
                        email: user.email,
                        name: user.name || user.email.split('@')[0],
                        role: 'student',
                        googleId: user.id
                    });
               }
               
               if (dbUser) {
                   token.id = dbUser._id.toString();
                   token.email = dbUser.email;
                   token.role = dbUser.role;
                   token.leetcode = dbUser.leetcode;
                   token.googleId = dbUser.googleId;
                   token.hasPassword = !!dbUser.password;
               }
           }
        }
        
        return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        if (token.email) {
          session.user.email = token.email as string;
        }
        (session.user as any).role = token.role;
        (session.user as any).leetcode = token.leetcode;
        (session.user as any).googleId = token.googleId;
        (session.user as any).hasPassword = token.hasPassword;
      }
      return session;
    },
  },
};
