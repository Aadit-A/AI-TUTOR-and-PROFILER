import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    leetcode?: string
    codeforces?: string
    hackerrank?: string
    role?: string
    user: {
      /** The user's postal address. */
      address?: string
      role?: string
      leetcode?: string
      codeforces?: string
      hackerrank?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    leetcode?: string
    codeforces?: string
    hackerrank?: string
    role?: string
  }
}
