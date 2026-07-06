import { withAuth } from "next-auth/middleware";

// Protect every /admin route except the login page. Unauthenticated
// visitors are redirected to /admin/login (configured via pages.signIn).
export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
