import { Storefront } from "./storefront";
import { getCatalogueProducts } from "../db/catalogue";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getCatalogueProducts();
  return <Storefront products={products} />;
}
