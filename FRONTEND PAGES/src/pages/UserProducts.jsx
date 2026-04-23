import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProducts.css";

const COLORS = ["Blue","Pink","Multi","Black","Green","Purple","Red","White"];
const DISCOUNTS = [10, 20, 30, 40, 50];

export default function UserProducts() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [wishlist, setWishlist]   = useState(new Set());
  const [search, setSearch]       = useState("");
  const [maxPrice, setMaxPrice]   = useState(10000);
  const [minDiscount, setMinDiscount] = useState(0);
  const navigate = useNavigate();

  /* ─── fetch ALL products from your backend ─── */
  useEffect(() => {
    fetch("http://localhost:8087/product/all")
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleWish = (e, id) => {
    e.stopPropagation();
    setWishlist(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const disc = (p) =>
    p.mrp && p.mrp > p.price
      ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
      : 0;

  /* ─── filter ─── */
  const filtered = products.filter(p => {
    const name = (p.productName || "").toLowerCase();
    const brand = (p.brand || "").toLowerCase();
    const q = search.toLowerCase();
    if (q && !name.includes(q) && !brand.includes(q)) return false;
    if ((p.price || 0) > maxPrice) return false;
    if (disc(p) < minDiscount) return false;
    return true;
  });

  if (loading) return (
    <div className="up-loading">
      <div className="up-spinner" />
      <p>Loading Products…</p>
    </div>
  );

  return (
    <div className="up-page">

      {/* ── Sidebar ── */}
      <aside className="up-sidebar">
        <h3 className="up-filter-title">FILTERS</h3>

        {/* Search inside sidebar */}
        <div className="up-filter-section">
          <h4>SEARCH</h4>
          <input
            className="up-search-input"
            placeholder="Brand, product…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="up-filter-section">
          <h4>PRICE</h4>
          <div className="up-price-display">₹100 – ₹{maxPrice.toLocaleString()}</div>
          <input
            type="range" min={100} max={10000} step={100}
            value={maxPrice}
            onChange={e => setMaxPrice(+e.target.value)}
            className="up-slider"
          />
        </div>

        {/* Discount */}
        <div className="up-filter-section">
          <h4>DISCOUNT RANGE</h4>
          {DISCOUNTS.map(d => (
            <label key={d} className="up-radio-label">
              <input
                type="radio" name="disc"
                checked={minDiscount === d}
                onChange={() => setMinDiscount(d)}
              />
              {d}% and above
            </label>
          ))}
          <label className="up-radio-label">
            <input type="radio" name="disc" checked={minDiscount === 0} onChange={() => setMinDiscount(0)} />
            All
          </label>
        </div>

        {/* Categories */}
        <div className="up-filter-section">
          <h4>CATEGORIES</h4>
          {["Kurta Sets","Kurtis","Tops","Dresses","Jeans"].map(c => (
            <label key={c} className="up-check-label">
              <input type="checkbox" /> {c}
            </label>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="up-main">

        {/* Header row */}
        <div className="up-header">
          <div className="up-breadcrumb">Home / <span>All Products</span></div>
          <div className="up-meta">
            <h2>All Products <span className="up-count">– {filtered.length} items</span></h2>
            <select className="up-sort">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Discount</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="up-empty">
            <div style={{fontSize:56}}>🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="up-grid">
            {filtered.map(p => {
              const d = disc(p);
              /* ── image URL from your backend ── */
              const imgUrl = p.imageUrl
                ? `http://localhost:8087${p.imageUrl}`
                : null;

              return (
                <div
                  key={p.productId}
                  className="up-card"
                  onClick={() =>
                    navigate(`/product/${p.productId}`, { state: { product: p } })
                  }
                >
                  {/* Image */}
                  <div className="up-img-wrap">
                    {imgUrl ? (
                      <img src={imgUrl} alt={p.productName} className="up-img" />
                    ) : (
                      <div className="up-img-ph">
                        <span className="up-ph-icon">👗</span>
                        <span className="up-ph-brand">{p.brand || "Product"}</span>
                      </div>
                    )}
                    {/* Wishlist */}
                    <button
                      className={`up-wish ${wishlist.has(p.productId) ? "up-wish--on" : ""}`}
                      onClick={e => toggleWish(e, p.productId)}
                    >
                      {wishlist.has(p.productId) ? "♥" : "♡"}
                    </button>
                    {/* Discount badge */}
                    {d >= 10 && (
                      <div className="up-disc-badge">{d}% OFF</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="up-info">
                    {p.brand && <div className="up-brand">{p.brand}</div>}
                    <div className="up-name">{p.productName}</div>

                    {/* Rating — show if exists */}
                    {p.rating && (
                      <div className="up-rating-row">
                        <span
                          className="up-rating-badge"
                          style={{
                            background: p.rating >= 4 ? "#14958f"
                              : p.rating >= 3 ? "#ff9f00" : "#f16565"
                          }}
                        >
                          {p.rating} ★
                        </span>
                        {p.reviews && (
                          <span className="up-reviews">
                            | {p.reviews > 999
                              ? (p.reviews/1000).toFixed(1)+"k"
                              : p.reviews}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="up-price-row">
                      <span className="up-price">Rs. {p.price?.toLocaleString()}</span>
                      {p.mrp && p.mrp > p.price && (
                        <span className="up-mrp">Rs. {p.mrp?.toLocaleString()}</span>
                      )}
                      {d > 0 && (
                        <span className="up-off">({d}% OFF)</span>
                      )}
                    </div>

                    {/* Stock warning */}
                    {p.quantity < 5 && p.quantity > 0 && (
                      <div className="up-low-stock">Only {p.quantity} left!</div>
                    )}
                    {p.quantity === 0 && (
                      <div className="up-out-stock">Out of Stock</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
