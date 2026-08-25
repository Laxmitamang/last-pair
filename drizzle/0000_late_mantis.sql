CREATE TYPE "public"."product_category" AS ENUM('Trainers', 'Running', 'Casual');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" text NOT NULL,
	"sku" varchar(64) NOT NULL,
	"size_uk" numeric(3, 1) NOT NULL,
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_stock_nonnegative" CHECK ("product_variants"."stock_quantity" >= 0),
	CONSTRAINT "product_variants_size_positive" CHECK ("product_variants"."size_uk" > 0)
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"brand" varchar(120) NOT NULL,
	"category" "product_category" NOT NULL,
	"description" text NOT NULL,
	"colour" varchar(120) NOT NULL,
	"price_pence" integer NOT NULL,
	"original_price_pence" integer NOT NULL,
	"image_url" text,
	"image_position" varchar(40) DEFAULT 'center' NOT NULL,
	"badge" varchar(80),
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_price_positive" CHECK ("products"."price_pence" > 0),
	CONSTRAINT "products_original_price_valid" CHECK ("products"."original_price_pence" >= "products"."price_pence")
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_sku_unique" ON "product_variants" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_product_size_unique" ON "product_variants" USING btree ("product_id","size_uk");--> statement-breakpoint
CREATE INDEX "product_variants_product_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");