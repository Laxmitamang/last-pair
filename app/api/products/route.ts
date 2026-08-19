import { products } from "../../products";

export async function GET() {
  return Response.json({ data: products, meta: { total: products.length } });
}
