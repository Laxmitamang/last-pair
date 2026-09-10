import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminDashboardMetrics } from "../../db/admin";
import { auth } from "../../lib/auth";
import { hasAdminRole } from "../../lib/authorization";

export const metadata: Metadata = { title: "Admin — Last Pair" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (!hasAdminRole(session.user.role)) redirect("/account");

  const metrics = await getAdminDashboardMetrics();

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="brand" href="/">LAST PAIR<span>●</span></Link>
        <div><span>Administrator</span><Link href="/account">Your account</Link></div>
      </header>
      <section className="admin-content">
        <div className="admin-intro">
          <div><p className="eyebrow">Store administration</p><h1>Good inventory.<br /><em>Clear decisions.</em></h1></div>
          <p>Welcome, {session.user.name}. This protected workspace will grow into the operational side of Last Pair.</p>
        </div>

        <div className="admin-metrics">
          <article><span>01</span><strong>{metrics.products}</strong><p>Products</p><small>{metrics.activeProducts} currently active</small></article>
          <article><span>02</span><strong>{metrics.variants}</strong><p>Size variants</p><small>{metrics.unitsInStock} units available</small></article>
          <article><span>03</span><strong>{metrics.customers}</strong><p>Customer accounts</p><small>Stored securely</small></article>
        </div>

        <div className="admin-next">
          <p className="eyebrow">Next capability</p>
          <h2>Product management</h2>
          <p>Create products, manage sizes and update stock without writing SQL manually.</p>
          <span>Coming in the next feature →</span>
        </div>
      </section>
    </main>
  );
}
