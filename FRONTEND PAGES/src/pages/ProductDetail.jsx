import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    if (!product) {
      fetch(`http://localhost:8087/product/${id}`)
        .then((r) => r.json())
        .then((data) => { setProduct(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <div className="pd-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  if (!product) return (
    <div className="pd-loading">
      <h2>Product not found</h2>
      <button onClick={() => navigate("/products")} className="back-btn">← Back to Products</button>
    </div>
  );

  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : null;

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      document.getElementById("size-section").scrollIntoView({ behavior: "smooth" });
      return;
    }
    addToCart(product, selectedSize, 1);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      document.getElementById("size-section").scrollIntoView({ behavior: "smooth" });
      return;
    }
    addToCart(product, selectedSize, 1);
    navigate("/cart");
  };

  // Mock images array (in real app these come from backend)
  const images = product.images || [null, null, null];

  return (
    <div className="pd-page">
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <span onClick={() => navigate("/")}>Home</span> /
        <span onClick={() => navigate("/products")}> Clothing</span> /
        <span onClick={() => navigate("/products")}> Kurtas</span> /
        <span className="active"> {product.brand} Kurtas</span>
      </div>

      <div className="pd-content">
        {/* Left: Images */}
        <div className="pd-images">
          {/* Thumbnail strip */}
          <div className="pd-thumbs">
            {images.map((img, i) => (
              <div
                key={i}
                className={`pd-thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              >
                {img ? (
                  <img src={img} alt="" />
                ) : (
                  <div className="thumb-placeholder">
                    <span>👗</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main image */}
          <div className="pd-main-img">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.productName} />
            ) : (
              <div className="main-img-placeholder">
                <div className="big-icon">👗</div>
                <div className="big-brand">{product.brand}</div>
                <div className="big-name">{product.productName}</div>
              </div>
            )}
            <button
              className={`pd-wishlist-btn ${wishlist ? "wished" : ""}`}
              onClick={() => setWishlist(!wishlist)}
            >
              {wishlist ? "♥" : "♡"}
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="pd-details">
          <h1 className="pd-brand">{product.brand}</h1>
          <h2 className="pd-product-name">{product.productName}</h2>

          {product.rating && (
            <div className="pd-rating-row">
              <span className="pd-rating-badge"
                style={{ background: product.rating >= 4 ? "#14958f" : product.rating >= 3 ? "#ff9f00" : "#f16565" }}>
                {product.rating} ★
              </span>
              <span className="pd-reviews">{product.reviews?.toLocaleString()} Ratings</span>
            </div>
          )}

          <div className="pd-divider"></div>

          {/* Price */}
          <div className="pd-price-section">
            <span className="pd-current-price">₹{product.price?.toLocaleString()}</span>
            {product.mrp && (
              <>
                <span className="pd-mrp">MRP ₹{product.mrp?.toLocaleString()}</span>
                <span className="pd-discount">({discount}% OFF)</span>
              </>
            )}
            <div className="pd-tax-note">inclusive of all taxes</div>
          </div>

          {/* Size Selector */}
          <div id="size-section" className="pd-size-section">
            <div className="pd-size-header">
              <span className="pd-size-label">SELECT SIZE</span>
              <span className="pd-size-chart">SIZE CHART ›</span>
            </div>
            {sizeError && !selectedSize && (
              <div className="size-error">⚠ Please select a size</div>
            )}
            <div className="pd-sizes">
              {SIZE_OPTIONS.map((s) => {
                const sizePrice = s === "L" || s === "XL" ? product.price + 53 : product.price;
                return (
                  <div
                    key={s}
                    className={`size-option ${selectedSize === s ? "selected" : ""}`}
                    onClick={() => { setSelectedSize(s); setSizeError(false); }}
                  >
                    <div className="size-label">{s}</div>
                    <div className="size-price">Rs. {sizePrice}</div>
                    {s === "M" && <div className="size-stock">2 left</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pd-actions">
            <button className="btn-add-bag" onClick={handleAddToBag}>
              🛍 ADD TO BAG
            </button>
            <button className="btn-wishlist" onClick={() => setWishlist(!wishlist)}>
              {wishlist ? "♥" : "♡"} WISHLIST
            </button>
          </div>

          {addedMsg && (
            <div className="added-toast">✅ Added to bag!</div>
          )}

          {/* Delivery */}
          <div className="pd-delivery">
            <h4 className="pd-section-title">DELIVERY OPTIONS</h4>
            <div className="delivery-input">
              <input type="text" placeholder="Enter delivery pincode" maxLength={6} />
              <button>CHECK</button>
            </div>
            <div className="delivery-info">
              <span>🚚</span> Usually delivered in 5-7 days
            </div>
          </div>

          <div className="pd-divider"></div>

          {/* Product Details */}
          <div className="pd-product-details">
            <h4 className="pd-section-title">PRODUCT DETAILS</h4>
            <ul className="details-list">
              {product.color && <li>{product.color} printed kurta</li>}
              <li>Floral printed</li>
              <li>V-neck</li>
              <li>Three-quarter, regular sleeves</li>
              <li>Straight shape with regular style</li>
              <li>Calf length with straight hem</li>
              <li>Machine weave regular cotton</li>
            </ul>
          </div>

          <div className="pd-divider"></div>

          {/* Specifications */}
          <div className="pd-specs">
            <h4 className="pd-section-title">Specifications</h4>
            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-key">Sleeve Length</div>
                <div className="spec-val">Three-Quarter Sleeves</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Shape</div>
                <div className="spec-val">Straight</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Neck</div>
                <div className="spec-val">V-Neck</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Design Styling</div>
                <div className="spec-val">Regular</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Material</div>
                <div className="spec-val">{product.material || "Cotton"}</div>
              </div>
              <div className="spec-item">
                <div className="spec-key">Occasion</div>
                <div className="spec-val">Casual</div>
              </div>
            </div>
          </div>

          <div className="pd-size-fit">
            <h4 className="pd-section-title">Size & Fit</h4>
            <p>The model (height 5'8) is wearing a size S</p>
          </div>

          <div className="pd-material-care">
            <h4 className="pd-section-title">Material & Care</h4>
            <p>Cotton</p>
            <p>Machine Wash</p>
          </div>
        </div>
      </div>
    </div>
  );
}
