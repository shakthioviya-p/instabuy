import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const BRANDS = [
  { name: "Rare Rabbit", tagline: "Style Meets Comfort", discount: "Min. 50% Off", bg: "#e8e0f5" },
  { name: "Snitch", tagline: "Modern Comfort", discount: "Min. 60% Off", bg: "#fce4ec" },
  { name: "Powerlook", tagline: "Effortless Fashion", discount: "Min. 60% Off", bg: "#e3f2fd" },
  { name: "FableStreet", tagline: "Western Flair, Modern Elegance", discount: "Min. 50% Off", bg: "#e8f5e9" },
  { name: "House of Chikankari", tagline: "Shine with Confidence", discount: "Min. 30% Off", bg: "#fff8e1" },
];

const CATEGORIES = [
  { label: "Ethnic Wear", discount: "50-80% OFF", icon: "🥻", bg: "linear-gradient(135deg,#ff7043,#e64a19)", query: "ethnic" },
  { label: "WFH Casual Wear", discount: "40-80% OFF", icon: "👕", bg: "linear-gradient(135deg,#ef5350,#c62828)", query: "casual" },
  { label: "Activewear", discount: "30-70% OFF", icon: "🏃", bg: "linear-gradient(135deg,#e53935,#b71c1c)", query: "activewear" },
  { label: "Western Wear", discount: "40-80% OFF", icon: "👗", bg: "linear-gradient(135deg,#f44336,#d32f2f)", query: "western" },
  { label: "Sportswear", discount: "30-80% OFF", icon: "⚽", bg: "linear-gradient(135deg,#ff5722,#bf360c)", query: "sports" },
  { label: "Kurta Sets", discount: "50-80% OFF", icon: "👘", bg: "linear-gradient(135deg,#f4511e,#e64a19)", query: "kurta" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>END OF SEASON SALE</h1>
          <p>Upto 80% off on top brands</p>
          <button onClick={() => navigate("/user -products")} className="shop-now-hero">
            SHOP NOW
          </button>
        </div>
        <div className="hero-emoji-grid">
          {["👗", "👘", "🥻", "👚", "👖", "🧥"].map((e, i) => (
            <div key={i} className="hero-emoji" style={{ animationDelay: `${i * 0.15}s` }}>{e}</div>
          ))}
        </div>
      </div>

      {/* Rising Stars */}
      <section className="home-section">
        <h2 className="section-title">RISING STARS</h2>
        <div className="brands-row">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="brand-card"
              style={{ background: b.bg }}
              onClick={() => navigate(`/user-products?search=${b.name}`)}
            >
              <div className="brand-emoji">✨</div>
              <div className="brand-name">{b.name}</div>
              <div className="brand-tagline">{b.tagline}</div>
              <div className="brand-discount">{b.discount}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="home-section">
        <h2 className="section-title">SHOP BY CATEGORY</h2>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <div
              key={c.label}
              className="category-card"
              onClick={() => navigate(`/products?category=${c.query}`)}
            >
              <div className="cat-icon">{c.icon}</div>
              <div className="cat-overlay" style={{ background: c.bg }}>
                <div className="cat-label">{c.label}</div>
                <div className="cat-discount">{c.discount}</div>
                <div className="cat-shop">Shop Now</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Picks */}
      <section className="home-section">
        <h2 className="section-title">TOP PICKS FOR YOU</h2>
        <div className="top-picks-row">
          {[
            { label: "Kurtis for Women", icon: "👘", disc: "344,565 styles" },
            { label: "Ethnic Sets", icon: "🥻", disc: "210,305 styles" },
            { label: "Casual Tops", icon: "👚", disc: "150,000 styles" },
            { label: "Palazzos", icon: "👖", disc: "89,000 styles" },
          ].map((p) => (
            <div
              key={p.label}
              className="top-pick-card"
              onClick={() => navigate("/user-products")}
            >
              <div className="pick-icon">{p.icon}</div>
              <div className="pick-label">{p.label}</div>
              <div className="pick-count">{p.disc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <h4>ONLINE SHOPPING</h4>
            <ul>
              <li>Men</li><li>Women</li><li>Kids</li>
              <li>Home</li><li>Beauty</li><li>Gift Cards</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>CUSTOMER POLICIES</h4>
            <ul>
              <li>Contact Us</li><li>FAQ</li><li>T&amp;C</li>
              <li>Terms Of Use</li><li>Track Orders</li><li>Shipping</li>
              <li>Cancellation</li><li>Returns</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>EXPERIENCE MYNTRA APP ON MOBILE</h4>
            <div className="app-badges">
              <div className="app-badge">📱 Google Play</div>
              <div className="app-badge">🍎 App Store</div>
            </div>
            <h4 style={{marginTop: 20}}>KEEP IN TOUCH</h4>
            <div className="social-row">
              <span>📘</span><span>🐦</span><span>▶️</span><span>📷</span>
            </div>
          </div>
          <div className="footer-col footer-trust">
            <div className="trust-item">
              <div className="trust-icon">🏅</div>
              <div>
                <strong>100% ORIGINAL</strong>
                <p>guarantee for all products at myntra.com</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🔄</div>
              <div>
                <strong>Return within 14 days</strong>
                <p>of receiving your order</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
