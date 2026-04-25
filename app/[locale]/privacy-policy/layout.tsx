// This layout intentionally has no extra wrappers.
// The parent [locale]/layout.tsx already provides Navbar, Footer providers, etc.
export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}