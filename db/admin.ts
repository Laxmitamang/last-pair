import "server-only";

import { count, eq, sql } from "drizzle-orm";
import { user } from "./auth-schema";
import { getDb } from "./index";
import { productVariants, products } from "./schema";

export async function getAdminDashboardMetrics() {
  const [productResult, activeResult, variantResult, customerResult, stockResult] =
    await Promise.all([
      getDb().select({ value: count() }).from(products),
      getDb().select({ value: count() }).from(products).where(eq(products.status, "active")),
      getDb().select({ value: count() }).from(productVariants),
      getDb().select({ value: count() }).from(user),
      getDb().select({
        value: sql<number>`coalesce(sum(${productVariants.stockQuantity}), 0)::int`,
      }).from(productVariants),
    ]);

  return {
    products: productResult[0]?.value ?? 0,
    activeProducts: activeResult[0]?.value ?? 0,
    variants: variantResult[0]?.value ?? 0,
    customers: customerResult[0]?.value ?? 0,
    unitsInStock: stockResult[0]?.value ?? 0,
  };
}
