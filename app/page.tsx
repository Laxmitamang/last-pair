import { headers } from "next/headers";
import { Storefront } from "./storefront";
import { getCatalogueProducts } from "../db/catalogue";
import { auth } from "../lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, session] = await Promise.all([
    getCatalogueProducts(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const customer = session
    ? { name: session.user.name, email: session.user.email }
    : null;

  return <Storefront products={products} customer={customer} />;
}
