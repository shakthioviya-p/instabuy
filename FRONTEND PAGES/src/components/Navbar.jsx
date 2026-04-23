import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg viewBox="0 0 60 40" width="52" height="35">
            <text x="0" y="32" fontFamily="'Georgia', serif" fontSize="36" fontWeight="bold">
              <tspan fill="#FF3F6C">M</tspan>
            </text>
          </svg>
        </Link>

        {/* Nav Links */}
        <div className="navbar-links">
          <Link to="/products?gender=men" className="nav-link">MEN</Link>
          <Link to="/products?gender=women" className="nav-link">WOMEN</Link>
          <Link to="/products?gender=kids" className="nav-link">KIDS</Link>
          <Link to="/products?category=home" className="nav-link">HOME</Link>
          <Link to="/products?category=beauty" className="nav-link">BEAUTY</Link>
          <Link to="/products" className="nav-link">GENZ</Link>
          <Link to="/dealer" className="nav-link nav-link-studio">
            STUDIO <span className="new-badge">NEW</span>
          </Link>
        </div>

        {/* Search */}
        <div className="navbar-search">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#696b79" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Right Icons */}
        <div className="navbar-actions">
          <div className="nav-action">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3e4152" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Profile</span>
          </div>
          <div className="nav-action">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3e4152" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>Wishlist</span>
          </div>
          <Link to="/cart" className="nav-action cart-action">
            <div className="cart-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3e4152" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
            <span>Bag</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
