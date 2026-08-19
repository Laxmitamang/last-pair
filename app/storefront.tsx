"use client";

import { useMemo, useState } from "react";
import type { Product } from "./products";

type CartLine = Product & { quantity:number; selectedSize:string };
const categories = ["All", "Trainers", "Running", "Casual"] as const;
const money = (n:number) => new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(n);

export function Storefront({products}:{products:Product[]}) {
  const [category,setCategory] = useState<(typeof categories)[number]>("All");
  const [query,setQuery] = useState("");
  const [cart,setCart] = useState<CartLine[]>([]);
  const [cartOpen,setCartOpen] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [selectedSizes,setSelectedSizes] = useState<Record<string,string>>({});
  const visible = useMemo(() => products.filter(p => (category === "All" || p.category === category) && `${p.name} ${p.brand} ${p.color}`.toLowerCase().includes(query.toLowerCase())),[products,category,query]);
  const itemCount = cart.reduce((n,p)=>n+p.quantity,0);
  const subtotal = cart.reduce((n,p)=>n+p.price*p.quantity,0);

  function add(product:Product){
    const selectedSize = selectedSizes[product.id] || product.sizes[0];
    setSelectedSizes(s=>({...s,[product.id]:selectedSize}));
    setCart(current=>{const match=current.find(p=>p.id===product.id&&p.selectedSize===selectedSize);return match?current.map(p=>p===match?{...p,quantity:p.quantity+1}:p):[...current,{...product,selectedSize,quantity:1}]});
    setCartOpen(true);
  }
  function change(id:string,size:string,delta:number){setCart(c=>c.map(p=>p.id===id&&p.selectedSize===size?{...p,quantity:p.quantity+delta}:p).filter(p=>p.quantity>0))}

  return <main>
    <div className="announcement">Student budget. Proper shoes. <span>New clearance drops every Friday →</span></div>
    <header className="site-header">
      <a className="brand" href="#top">LAST PAIR<span>●</span></a>
      <button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Menu</button>
      <nav className={menuOpen?"nav-links open":"nav-links"}><a href="#drop">Latest drop</a><a href="#how">How it works</a><a href="#mission">Our mission</a></nav>
      <div className="header-actions"><button className="text-button">Sign in</button><button className="cart-button" onClick={()=>setCartOpen(true)}>Bag <span>{itemCount}</span></button></div>
    </header>

    <section className="shoe-hero" id="top">
      <div className="shoe-hero-copy"><p className="eyebrow">Clearance shoes. Curated properly.</p><h1>Big brands.<br/><em>Small prices.</em></h1><p>End-of-season pairs, warehouse finds and serious reductions—sourced for students and anyone who would rather pay less.</p><a className="primary-link" href="#drop">Shop the latest drop <span>↘</span></a></div>
      <div className="shoe-hero-image" role="img" aria-label="A curated arrangement of clearance trainers"><div className="drop-stamp">DROP 01<br/><strong>UP TO 60% OFF</strong></div></div>
    </section>

    <section className="proof-strip"><p><strong>01</strong> Authentic pairs only</p><p><strong>02</strong> Clear savings, always</p><p><strong>03</strong> Limited stock, fair prices</p></section>

    <section className="drop-section" id="drop">
      <div className="section-heading"><div><p className="eyebrow">The latest drop</p><h2>Good shoes.<br/>Better timing.</h2></div><p>Clearance does not mean compromise. Every pair is unused, checked and priced against its original retail value.</p></div>
      <div className="shop-controls"><div className="filters">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="search-field"><span className="sr-only">Search shoes</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search brand, style or colour"/><span>⌕</span></label></div>
      <div className="product-grid">{visible.map((p,i)=><article className="product-card" key={p.id}>
        <div className="shoe-product-image" style={{backgroundPosition:p.imagePosition}}>{p.badge&&<span className="badge">{p.badge}</span>}<span className="index">0{i+1}</span></div>
        <div className="product-kicker"><span>{p.brand}</span><span>{p.category}</span></div>
        <div className="product-info"><div><h3>{p.name}</h3><p>{p.color}</p></div><div className="price"><strong>{money(p.price)}</strong><s>{money(p.originalPrice)}</s></div></div>
        <div className="size-row"><span>UK size</span><div>{p.sizes.map(size=><button key={size} className={(selectedSizes[p.id]||p.sizes[0])===size?"selected":""} onClick={()=>setSelectedSizes(s=>({...s,[p.id]:size}))}>{size}</button>)}</div></div>
        <button className="add-button" onClick={()=>add(p)}>Add size {selectedSizes[p.id]||p.sizes[0]} to bag <span>+</span></button>
      </article>)}</div>
      {!visible.length&&<div className="empty-state"><h3>No pairs found</h3><p>Try another search or see the complete drop.</p><button onClick={()=>{setQuery("");setCategory("All")}}>Show all pairs</button></div>}
    </section>

    <section className="how" id="how"><div><p className="eyebrow">How it works</p><h2>We find the reductions.<br/><em>You get first look.</em></h2></div><ol><li><span>01</span><div><h3>We source</h3><p>Clearance events, warehouse stock and end-of-line opportunities.</p></div></li><li><span>02</span><div><h3>We verify</h3><p>Every pair is checked, photographed and compared with its retail price.</p></div></li><li><span>03</span><div><h3>You save</h3><p>Small drops, limited sizes and honest savings—without the endless hunt.</p></div></li></ol></section>

    <section className="mission" id="mission"><p className="eyebrow">Built for real budgets</p><blockquote>“Style should not disappear when the student loan starts running low.”</blockquote><p>Last Pair is a business prototype testing a simpler idea: rescue quality footwear from clearance channels and make it easier for price-conscious customers to find.</p></section>
    <section className="signup"><div><p className="eyebrow">Do not miss your size</p><h2>Friday drops.<br/>No inbox clutter.</h2></div><form onSubmit={e=>e.preventDefault()}><label><span className="sr-only">Email address</span><input type="email" placeholder="you@university.ac.uk"/><button>Join the drop list →</button></label><small>Prototype signup — email delivery coming soon.</small></form></section>
    <footer><a className="brand inverse" href="#top">LAST PAIR<span>●</span></a><p>Better shoes for smaller budgets.<br/>Sourced in London, found for you.</p><div><a href="#drop">Shop</a><a href="#how">How it works</a><a href="#mission">About</a></div><small>© 2026 Last Pair. Prototype store. Product names and labels are fictional; no brand partnerships are implied.</small></footer>

    {cartOpen&&<button className="scrim" onClick={()=>setCartOpen(false)} aria-label="Close bag"/>}
    <aside className={cartOpen?"cart-drawer open":"cart-drawer"} aria-hidden={!cartOpen}><div className="drawer-heading"><div><p className="eyebrow">Your pairs</p><h2>Bag <span>{itemCount}</span></h2></div><button onClick={()=>setCartOpen(false)}>×</button></div><div className="cart-lines">{!cart.length?<div className="empty-cart"><p>No pairs yet.</p><span>Your size might not wait around.</span></div>:cart.map(p=><div className="cart-line" key={`${p.id}-${p.selectedSize}`}><div className="cart-thumb" style={{backgroundPosition:p.imagePosition}}/><div><p className="line-brand">{p.brand}</p><h3>{p.name}</h3><p>UK {p.selectedSize} · {money(p.price)}</p><div className="quantity"><button onClick={()=>change(p.id,p.selectedSize,-1)}>−</button><span>{p.quantity}</span><button onClick={()=>change(p.id,p.selectedSize,1)}>+</button></div></div></div>)}</div><div className="drawer-footer"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>You have saved {money(cart.reduce((n,p)=>n+(p.originalPrice-p.price)*p.quantity,0))} against retail.</p><button disabled={!cart.length}>Prototype checkout <span>→</span></button><small>No payment will be taken in this prototype.</small></div></aside>
  </main>
}
