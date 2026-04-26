import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "es", "fr"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: [
    "/((?!dashboard|api|_next|favicon\\.ico|logo.*|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.mp4|.*\\.webp).*)",
  ],
};