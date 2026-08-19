import { Storefront } from "./storefront";
import { products } from "./products";

export default function Home() {
  return <Storefront products={products} />;
}
