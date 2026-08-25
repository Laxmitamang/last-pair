import { getCatalogueProducts } from "../../../db/catalogue";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getCatalogueProducts();
  return Response.json({ data: products, meta: { total: products.length } });
}
