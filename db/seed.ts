import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { productVariants, products } from "./schema";

type SeedProduct = typeof products.$inferInsert & {
  variants: Array<{
    sku: string;
    sizeUk: string;
    stockQuantity: number;
  }>;
};

const catalogue: SeedProduct[] = [
  {
    id: "court-90",
    name: "Court 90 Leather",
    brand: "North Standard",
    category: "Trainers",
    description: "A clean leather court trainer sourced from end-of-season stock.",
    colour: "Bone / Navy",
    pricePence: 4200,
    originalPricePence: 9500,
    imagePosition: "82% 10%",
    badge: "56% off",
    status: "active",
    variants: [
      { sku: "COURT90-5", sizeUk: "5.0", stockQuantity: 2 },
      { sku: "COURT90-6", sizeUk: "6.0", stockQuantity: 3 },
      { sku: "COURT90-7", sizeUk: "7.0", stockQuantity: 2 },
      { sku: "COURT90-8", sizeUk: "8.0", stockQuantity: 1 },
    ],
  },
  {
    id: "relay-runner",
    name: "Relay Runner",
    brand: "Form Athletics",
    category: "Running",
    description: "A lightweight running shoe found in a limited warehouse clearance.",
    colour: "Midnight",
    pricePence: 4800,
    originalPricePence: 11000,
    imagePosition: "67% 37%",
    badge: "Last sizes",
    status: "active",
    variants: [
      { sku: "RELAY-7", sizeUk: "7.0", stockQuantity: 1 },
      { sku: "RELAY-8", sizeUk: "8.0", stockQuantity: 2 },
      { sku: "RELAY-9", sizeUk: "9.0", stockQuantity: 2 },
      { sku: "RELAY-10", sizeUk: "10.0", stockQuantity: 1 },
    ],
  },
  {
    id: "pace-knit",
    name: "Pace Knit 2.0",
    brand: "Motion Dept.",
    category: "Running",
    description: "A breathable knit runner priced for everyday student journeys.",
    colour: "Oat / Sage",
    pricePence: 3900,
    originalPricePence: 8800,
    imagePosition: "48% 58%",
    status: "active",
    variants: [
      { sku: "PACE2-4", sizeUk: "4.0", stockQuantity: 2 },
      { sku: "PACE2-5", sizeUk: "5.0", stockQuantity: 2 },
      { sku: "PACE2-6", sizeUk: "6.0", stockQuantity: 3 },
      { sku: "PACE2-7", sizeUk: "7.0", stockQuantity: 1 },
    ],
  },
  {
    id: "terrace-low",
    name: "Terrace Low",
    brand: "East Borough",
    category: "Trainers",
    description: "A low-profile terrace trainer recovered from warehouse stock.",
    colour: "Rust / Cream",
    pricePence: 4400,
    originalPricePence: 10000,
    imagePosition: "83% 68%",
    badge: "Warehouse find",
    status: "active",
    variants: [
      { sku: "TERRACE-6", sizeUk: "6.0", stockQuantity: 2 },
      { sku: "TERRACE-7", sizeUk: "7.0", stockQuantity: 2 },
      { sku: "TERRACE-8", sizeUk: "8.0", stockQuantity: 1 },
      { sku: "TERRACE-11", sizeUk: "11.0", stockQuantity: 1 },
    ],
  },
  {
    id: "studio-canvas",
    name: "Studio Canvas",
    brand: "Common Ground",
    category: "Casual",
    description: "An understated canvas shoe for lectures, work and weekends.",
    colour: "Natural",
    pricePence: 3500,
    originalPricePence: 7500,
    imagePosition: "57% 86%",
    status: "active",
    variants: [
      { sku: "STUDIO-4", sizeUk: "4.0", stockQuantity: 2 },
      { sku: "STUDIO-5", sizeUk: "5.0", stockQuantity: 3 },
      { sku: "STUDIO-6", sizeUk: "6.0", stockQuantity: 2 },
      { sku: "STUDIO-9", sizeUk: "9.0", stockQuantity: 1 },
    ],
  },
  {
    id: "harbour-walk",
    name: "Harbour Walk",
    brand: "Mile & Coast",
    category: "Casual",
    description: "A comfortable everyday shoe from a small end-of-line batch.",
    colour: "Deep Navy",
    pricePence: 4600,
    originalPricePence: 10500,
    imagePosition: "19% 84%",
    badge: "Only 3 left",
    status: "active",
    variants: [
      { sku: "HARBOUR-7", sizeUk: "7.0", stockQuantity: 1 },
      { sku: "HARBOUR-8", sizeUk: "8.0", stockQuantity: 1 },
      { sku: "HARBOUR-9", sizeUk: "9.0", stockQuantity: 1 },
    ],
  },
];

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database");
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

try {
  await db.transaction(async (transaction) => {
    for (const { variants, ...product } of catalogue) {
      await transaction
        .insert(products)
        .values(product)
        .onConflictDoUpdate({
          target: products.id,
          set: {
            name: product.name,
            brand: product.brand,
            category: product.category,
            description: product.description,
            colour: product.colour,
            pricePence: product.pricePence,
            originalPricePence: product.originalPricePence,
            imageUrl: product.imageUrl,
            imagePosition: product.imagePosition,
            badge: product.badge,
            status: product.status,
            updatedAt: new Date(),
          },
        });

      for (const variant of variants) {
        await transaction
          .insert(productVariants)
          .values({ ...variant, productId: product.id })
          .onConflictDoUpdate({
            target: [productVariants.productId, productVariants.sizeUk],
            set: {
              sku: variant.sku,
              stockQuantity: variant.stockQuantity,
              updatedAt: new Date(),
            },
          });
      }
    }
  });

  console.log(`Seeded ${catalogue.length} products successfully.`);
} finally {
  await client.end();
}
