export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Trainers" | "Running" | "Casual";
  price: number;
  originalPrice: number;
  color: string;
  sizes: string[];
  imagePosition: string;
  badge?: string;
};
