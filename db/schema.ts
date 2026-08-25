import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const productCategory = pgEnum("product_category", [
  "Trainers",
  "Running",
  "Casual",
]);

export const productStatus = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    brand: varchar("brand", { length: 120 }).notNull(),
    category: productCategory("category").notNull(),
    description: text("description").notNull(),
    colour: varchar("colour", { length: 120 }).notNull(),
    pricePence: integer("price_pence").notNull(),
    originalPricePence: integer("original_price_pence").notNull(),
    imageUrl: text("image_url"),
    imagePosition: varchar("image_position", { length: 40 })
      .notNull()
      .default("center"),
    badge: varchar("badge", { length: 80 }),
    status: productStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_status_idx").on(table.status),
    check("products_price_positive", sql`${table.pricePence} > 0`),
    check(
      "products_original_price_valid",
      sql`${table.originalPricePence} >= ${table.pricePence}`,
    ),
  ],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 64 }).notNull(),
    sizeUk: numeric("size_uk", { precision: 3, scale: 1 }).notNull(),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("product_variants_sku_unique").on(table.sku),
    uniqueIndex("product_variants_product_size_unique").on(
      table.productId,
      table.sizeUk,
    ),
    index("product_variants_product_idx").on(table.productId),
    check("product_variants_stock_nonnegative", sql`${table.stockQuantity} >= 0`),
    check("product_variants_size_positive", sql`${table.sizeUk} > 0`),
  ],
);
