import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getAuthAccount } from "@/lib/auth";

export default async function PageShell({ children }: { children: ReactNode }) {
  const account = await getAuthAccount();
  return (
    <>
      <Header authed={Boolean(account)} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
