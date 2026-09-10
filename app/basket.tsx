"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "last-pair-basket-v1";

export type BasketProduct = {
  productId: string;
  name: string;
  brand: string;
  color: string;
  price: number;
  originalPrice: number;
  imagePosition: string;
  imageUrl?: string | null;
};

export type BasketVariant = {
  variantId: string;
  size: string;
  stockQuantity: number;
};

type BasketLine = BasketProduct & BasketVariant & { quantity: number };

type BasketContextValue = {
  lines: BasketLine[];
  itemCount: number;
  addItem: (product: BasketProduct, variant: BasketVariant) => void;
  changeQuantity: (variantId: string, delta: number) => void;
  removeItem: (variantId: string) => void;
  openBasket: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

const money = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);

function readStoredBasket(): BasketLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (line): line is BasketLine =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as BasketLine).productId === "string" &&
        typeof (line as BasketLine).variantId === "string" &&
        typeof (line as BasketLine).size === "string" &&
        typeof (line as BasketLine).quantity === "number" &&
        typeof (line as BasketLine).stockQuantity === "number",
    );
  } catch {
    return [];
  }
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const restoreBasket = window.setTimeout(() => {
      setLines(readStoredBasket());
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(restoreBasket);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [hydrated, lines]);

  function addItem(product: BasketProduct, variant: BasketVariant) {
    if (variant.stockQuantity < 1) return;

    setLines((current) => {
      const existing = current.find((line) => line.variantId === variant.variantId);
      if (!existing) return [...current, { ...product, ...variant, quantity: 1 }];

      return current.map((line) =>
        line.variantId === variant.variantId
          ? {
              ...line,
              ...product,
              ...variant,
              quantity: Math.min(line.quantity + 1, variant.stockQuantity),
            }
          : line,
      );
    });
    setOpen(true);
  }

  function changeQuantity(variantId: string, delta: number) {
    setLines((current) =>
      current
        .map((line) =>
          line.variantId === variantId
            ? {
                ...line,
                quantity: Math.min(line.quantity + delta, line.stockQuantity),
              }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function removeItem(variantId: string) {
    setLines((current) => current.filter((line) => line.variantId !== variantId));
  }

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);
  const savings = lines.reduce(
    (total, line) => total + (line.originalPrice - line.price) * line.quantity,
    0,
  );
  const value = useMemo(
    () => ({ lines, itemCount, addItem, changeQuantity, removeItem, openBasket: () => setOpen(true) }),
    [lines, itemCount],
  );

  return (
    <BasketContext.Provider value={value}>
      {children}
      {open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close bag" />}
      <aside className={open ? "cart-drawer open" : "cart-drawer"} aria-hidden={!open}>
        <div className="drawer-heading">
          <div><p className="eyebrow">Your pairs</p><h2>Bag <span>{itemCount}</span></h2></div>
          <button onClick={() => setOpen(false)} aria-label="Close bag">×</button>
        </div>
        <div className="cart-lines">
          {!lines.length ? (
            <div className="empty-cart"><p>No pairs yet.</p><span>Your size might not wait around.</span></div>
          ) : lines.map((line) => (
            <div className="cart-line" key={line.variantId}>
              <div className="cart-thumb" style={{
                backgroundImage: `url('${line.imageUrl ?? "/og.png"}')`,
                backgroundPosition: line.imagePosition,
              }} />
              <div>
                <p className="line-brand">{line.brand}</p>
                <h3>{line.name}</h3>
                <p>UK {line.size} · {money(line.price)}</p>
                <div className="quantity">
                  <button onClick={() => changeQuantity(line.variantId, -1)} aria-label={`Remove one ${line.name}, size ${line.size}`}>−</button>
                  <span>{line.quantity}</span>
                  <button disabled={line.quantity >= line.stockQuantity} onClick={() => changeQuantity(line.variantId, 1)} aria-label={`Add one ${line.name}, size ${line.size}`}>+</button>
                  <button className="remove-line" onClick={() => removeItem(line.variantId)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="drawer-footer">
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <p>You have saved {money(savings)} against retail.</p>
          <button disabled={!lines.length}>Prototype checkout <span>→</span></button>
          <small>No payment will be taken in this prototype.</small>
        </div>
      </aside>
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const basket = useContext(BasketContext);
  if (!basket) throw new Error("useBasket must be used within BasketProvider");
  return basket;
}
