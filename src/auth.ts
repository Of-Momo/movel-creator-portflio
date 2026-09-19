import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: { signIn: "/post/sign-in" },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      const owner = process.env.OWNER_EMAIL?.toLowerCase();
      if (email === owner) return true;

      try {
        const settings = await client.fetch(siteSettingsQuery);
        const assistants: string[] = (settings?.assistantEmails || []).map((e: string) => e.toLowerCase());
        if (settings?.assistantAccessEnabled && assistants.includes(email)) return true;
      } catch (err) {
        console.error("Failed to check assistant access:", err);
      }
      return false;
    },
    async jwt({ token }) {
      const owner = process.env.OWNER_EMAIL?.toLowerCase();
      token.role = token.email?.toLowerCase() === owner ? "owner" : "assistant";
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
});
