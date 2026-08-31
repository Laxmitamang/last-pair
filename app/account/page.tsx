import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = { title: "Your account — Last Pair" };

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");

  return (
    <main className="account-shell">
      <header className="account-header">
        <Link className="brand" href="/">LAST PAIR<span>●</span></Link>
        <LogoutButton />
      </header>
      <section className="account-content">
        <p className="eyebrow">Your account</p>
        <h1>Good to see you,<br /><em>{session.user.name}.</em></h1>
        <div className="account-grid">
          <article>
            <span>01</span>
            <h2>Profile</h2>
            <dl>
              <div><dt>Name</dt><dd>{session.user.name}</dd></div>
              <div><dt>Email</dt><dd>{session.user.email}</dd></div>
            </dl>
          </article>
          <article className="account-coming-soon">
            <span>02</span>
            <h2>Your pairs</h2>
            <p>Saved shoes and order history will live here as we build the next parts of the store.</p>
            <Link href="/#drop">Browse the latest drop →</Link>
          </article>
        </div>
      </section>
    </main>
  );
}
