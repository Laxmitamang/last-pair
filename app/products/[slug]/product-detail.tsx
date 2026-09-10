"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProductDetail } from "../../products";

const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

export function ProductDetailView({ product }: { product: ProductDetail }) {
  const firstAvailable = product.variants.find((variant) => variant.stockQuantity > 0);
  const [selectedVariantId, setSelectedVariantId] = useState(firstAvailable?.id ?? "");
  const [added, setAdded] = useState(false);
  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  function addToBag() {
    if (!selectedVariant) return;
    setAdded(true);
  }

  return (
    <main className="product-detail-shell">
      <div className="announcement">Student budget. Proper shoes. <span>Limited clearance stock →</span></div>
      <header className="product-detail-header">
        <Link className="brand" href="/">LAST PAIR<span>●</span></Link>
        <Link href="/#drop">← Back to the drop</Link>
        <Link href="/account">My account</Link>
      </header>

      <section className="product-detail-layout">
        <div
          className="product-detail-image"
          style={{
            backgroundImage: `url('${product.imageUrl ?? "/og.png"}')`,
            backgroundPosition: product.imagePosition,
          }}
          role="img"
          aria-label={`${product.brand} ${product.name} in ${product.color}`}
        >
          {product.badge && <span className="badge">{product.badge}</span>}
          <span className="product-image-note">Clearance pair · Unused</span>
        </div>

        <div className="product-detail-copy">
          <div>
            <p className="eyebrow">{product.brand} · {product.category}</p>
            <h1>{product.name}</h1>
            <p className="product-colour">{product.color}</p>
          </div>

          <div className="product-detail-price">
            <strong>{money(product.price)}</strong>
            <s>{money(product.originalPrice)}</s>
            <span>You save {money(product.originalPrice - product.price)}</span>
          </div>

          <p className="product-description">{product.description}</p>

          <fieldset className="product-size-picker">
            <legend>Select UK size</legend>
            <div>
              {product.variants.map((variant) => {
                const available = variant.stockQuantity > 0;
                return (
                  <button
                    type="button"
                    key={variant.id}
                    className={selectedVariantId === variant.id ? "selected" : ""}
                    disabled={!available}
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setAdded(false);
                    }}
                    aria-label={`UK size ${variant.size}${available ? "" : ", out of stock"}`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            className="product-add-button"
            type="button"
            disabled={!selectedVariant}
            onClick={addToBag}
          >
            <span>{added ? `Size ${selectedVariant?.size} selected` : "Add to prototype bag"}</span>
            <span>{added ? "✓" : "+"}</span>
          </button>
          {added && (
            <p className="product-add-note" role="status">
              Selection confirmed. Cross-page bag persistence is our next shopping feature.
            </p>
          )}

          <dl className="product-promises">
            <div><dt>Condition</dt><dd>New and unworn</dd></div>
            <div><dt>Authenticity</dt><dd>Checked before listing</dd></div>
            <div><dt>Availability</dt><dd>Limited clearance stock</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
