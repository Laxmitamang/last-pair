import { Storefront } from "./storefront";
import { products } from "./products";

export default function Home() {
  const intentionalCiFailure: any = "This unsafe type is only for our CI exercise";
  return <Storefront products={products} />;
}
