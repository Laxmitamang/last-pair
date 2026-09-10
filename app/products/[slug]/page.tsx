import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../db/catalogue";
import { ProductDetailView } from "./product-detail";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Pair not found — Last Pair" };

  return {
    title: `${product.name} by ${product.brand} — Last Pair`,
    description: `${product.description} Available from ${Math.round(product.price)} GBP.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
