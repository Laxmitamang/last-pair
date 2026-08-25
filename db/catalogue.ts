import { and, asc, eq, gt } from "drizzle-orm";
import type { Product } from "../app/products";
import { getDb } from "./index";
import { productVariants, products } from "./schema";

export async function getCatalogueProducts(): Promise<Product[]> {
  const rows = await getDb()
    .select({
      product: products,
      variant: productVariants,
    })
    .from(products)
    .innerJoin(
      productVariants,
      eq(productVariants.productId, products.id),
    )
    .where(
      and(
        eq(products.status, "active"),
        gt(productVariants.stockQuantity, 0),
      ),
    )
    .orderBy(asc(products.name), asc(productVariants.sizeUk));

  const catalogue = new Map<string, Product>();

  for (const { product, variant } of rows) {
    const existing = catalogue.get(product.id);
    const size = Number(variant.sizeUk).toString();

    if (existing) {
      existing.sizes.push(size);
      continue;
    }

    catalogue.set(product.id, {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.pricePence / 100,
      originalPrice: product.originalPricePence / 100,
      color: product.colour,
      sizes: [size],
      imagePosition: product.imagePosition,
      ...(product.badge ? { badge: product.badge } : {}),
    });
  }

  return [...catalogue.values()];
}
