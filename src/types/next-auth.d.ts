import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    leetcode?: string
    role?: string
    googleId?: string
    user: {
      /** The user's postal address. */
      address?: string
      id?: string
      role?: string
      leetcode?: string
      googleId?: string
      hasPassword?: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    leetcode?: string
    role?: string
    googleId?: string
    hasPassword?: boolean
  }
}
