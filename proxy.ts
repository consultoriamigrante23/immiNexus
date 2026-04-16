import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "es", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};