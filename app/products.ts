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

export const products: Product[] = [
  { id:"court-90", name:"Court 90 Leather", brand:"North Standard", category:"Trainers", price:42, originalPrice:95, color:"Bone / Navy", sizes:["5","6","7","8"], imagePosition:"82% 10%", badge:"56% off" },
  { id:"relay-runner", name:"Relay Runner", brand:"Form Athletics", category:"Running", price:48, originalPrice:110, color:"Midnight", sizes:["7","8","9","10"], imagePosition:"67% 37%", badge:"Last sizes" },
  { id:"pace-knit", name:"Pace Knit 2.0", brand:"Motion Dept.", category:"Running", price:39, originalPrice:88, color:"Oat / Sage", sizes:["4","5","6","7"], imagePosition:"48% 58%" },
  { id:"terrace-low", name:"Terrace Low", brand:"East Borough", category:"Trainers", price:44, originalPrice:100, color:"Rust / Cream", sizes:["6","7","8","11"], imagePosition:"83% 68%", badge:"Warehouse find" },
  { id:"studio-canvas", name:"Studio Canvas", brand:"Common Ground", category:"Casual", price:35, originalPrice:75, color:"Natural", sizes:["4","5","6","9"], imagePosition:"57% 86%" },
  { id:"harbour-walk", name:"Harbour Walk", brand:"Mile & Coast", category:"Casual", price:46, originalPrice:105, color:"Deep Navy", sizes:["7","8","9"], imagePosition:"19% 84%", badge:"Only 3 left" },
];
