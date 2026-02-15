import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdmin = auth?.user?.role === "ADMIN" || auth?.user?.role === "MANAGER"
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")
      if (isAdminRoute) {
        if (!isAdmin) return false
        return true
      }

      // Все остальные страницы публичны
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
