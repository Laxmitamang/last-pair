import "dotenv/config";
import assert from "node:assert/strict";
import test, { after } from "node:test";
import { GET } from "../app/api/products/route";
import { getCatalogueProducts } from "../db/catalogue";
import { closeDb } from "../db/index";

after(closeDb);

test("reads the active product catalogue from PostgreSQL", async () => {
  const catalogue = await getCatalogueProducts();
  const court90 = catalogue.find((product) => product.id === "court-90");

  assert.equal(catalogue.length, 6);
  assert.ok(court90);
  assert.deepEqual(court90.sizes, ["5", "6", "7", "8"]);
  assert.ok(catalogue.every((product) => product.price > 0));
});

test("serves the PostgreSQL catalogue through the products API", async () => {
  const response = await GET();
  assert.equal(response.status, 200);

  const payload = await response.json();
  assert.equal(payload.meta.total, 6);
  assert.ok(payload.data.some((product: { id: string }) => product.id === "court-90"));
});
