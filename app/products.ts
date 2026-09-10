export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Trainers" | "Running" | "Casual";
  price: number;
  originalPrice: number;
  color: string;
  sizes: string[];
  variants: Array<{
    id: string;
    size: string;
    stockQuantity: number;
  }>;
  imagePosition: string;
  badge?: string;
};

export type ProductDetail = Omit<Product, "sizes" | "variants"> & {
  description: string;
  imageUrl: string | null;
  variants: Array<{
    id: string;
    size: string;
    stockQuantity: number;
  }>;
};
