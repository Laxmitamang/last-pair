import assert from "node:assert/strict";
import test from "node:test";

async function request(path = "/", accept = "text/html") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Last Pair storefront", async () => {
  const response = await request();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Last Pair — Big brands\. Small prices\.<\/title>/i);
  assert.match(html, /Big brands/);
  assert.match(html, /Court 90 Leather/);
  assert.match(html, /Your pairs/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("serves the product catalogue API", async () => {
  const response = await request("/api/products", "application/json");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/i);

  const payload = await response.json();
  assert.equal(payload.meta.total, 6);
  assert.equal(payload.data[0].id, "court-90");
  assert.ok(payload.data.every((product) => product.price > 0));
});
