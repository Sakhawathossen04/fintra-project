export const metadata = {
  title: "Workspace",
};

/**
 * The workspace renders its own full-height dark shell — no marketing
 * header/footer. The root layout still wraps this (fonts, globals).
 */
export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <div className="dark-agent min-h-dvh bg-[#0a0908]">{children}</div>;
}
