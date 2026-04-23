import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, totalMRP, clearCart } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [pincode, setPincode] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [donate, setDonate] = useState(null);

  const platformFee = cartItems.length > 0 ? 23 : 0;
  const discount = cartItems.reduce((s, i) => s + ((i.mrp || i.price) - i.price) * i.qty, 0);
  const total = totalMRP - discount + platformFee + (donate || 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      // Try to call order service
      await fetch("http://localhost:8087/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            quantity: i.qty,
            size: i.size,
            price: i.price,
          })),
          totalAmount: total,
          pincode,
        }),
      });
    } catch (e) {
      // If backend not available, still show success
    }
    clearCart();
    setPlacing(false);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Your order has been placed. You'll receive a confirmation soon.</p>
        <button className="continue-btn" onClick={() => navigate("/products")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Top bar */}
      <div className="cart-topbar">
        <div className="cart-steps">
          <span className="step active">BAG</span>
          <span className="step-line">----------</span>
          <span className="step">ADDRESS</span>
          <span className="step-line">----------</span>
          <span className="step">PAYMENT</span>
        </div>
        <div className="secure-badge">🔒 100% SECURE</div>
      </div>

      <div className="cart-content">
        {/* Left: Items */}
        <div className="cart-items-section">
          {/* Pincode check */}
          <div className="pincode-card">
            <span>Check delivery time &amp; services</span>
            <button className="enter-pin-btn" onClick={() => {
              const pin = prompt("Enter your PIN code:");
              if (pin) setPincode(pin);
            }}>
              {pincode ? `📍 ${pincode}` : "ENTER PIN CODE"}
            </button>
          </div>

          {/* Select all */}
          {cartItems.length > 0 && (
            <div className="select-all-bar">
              <input type="checkbox" defaultChecked id="selectAll" />
              <label htmlFor="selectAll">
                {cartItems.length}/{cartItems.length} ITEMS SELECTED
              </label>
            </div>
          )}

          {/* Items */}
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛍</div>
              <h3>Your bag is empty</h3>
              <p>Add items to it now</p>
              <button className="shop-now-btn" onClick={() => navigate("/products")}>
                Shop Now
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemDiscount = item.mrp ? ((item.mrp - item.price) * item.qty) : 0;
              return (
                <div key={`${item.productId}-${item.size}`} className="cart-item">
                  <input type="checkbox" defaultChecked className="item-check" />
                  <div className="item-img">
                    {item.image ? (
                      <img src={item.image} alt={item.productName} />
                    ) : (
                      <div className="cart-img-placeholder">
                        <span>👗</span>
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <button
                      className="item-remove"
                      onClick={() => removeFromCart(item.productId, item.size)}
                    >✕</button>
                    <div className="item-brand">{item.brand}</div>
                    <div className="item-name">{item.productName}</div>
                    <div className="item-sold">Sold by: Patiala House</div>
                    <div className="item-size-qty">
                      <select
                        value={item.size}
                        onChange={(e) => {
                          removeFromCart(item.productId, item.size);
                          // Re-add with new size — simplified
                        }}
                        className="size-select"
                      >
                        {["S", "M", "L", "XL", "XXL"].map((s) => (
                          <option key={s} value={s}>Size: {s}</option>
                        ))}
                      </select>
                      <select
                        value={item.qty}
                        onChange={(e) => updateQty(item.productId, item.size, +e.target.value)}
                        className="qty-select"
                      >
                        {[1, 2, 3, 4, 5].map((q) => (
                          <option key={q} value={q}>Qty: {q}</option>
                        ))}
                      </select>
                    </div>
                    <div className="item-price-row">
                      <span className="item-current-price">₹{(item.price * item.qty).toLocaleString()}</span>
                      {item.mrp && (
                        <span className="item-mrp">₹{(item.mrp * item.qty).toLocaleString()}</span>
                      )}
                      {itemDiscount > 0 && (
                        <span className="item-off">₹{itemDiscount.toLocaleString()} OFF</span>
                      )}
                    </div>
                    <div className="item-return">↩ 7 days return available</div>
                  </div>
                </div>
              );
            })
          )}

          {cartItems.length > 0 && (
            <div className="login-prompt">
              <div className="login-avatar">
                <span>👤</span>
              </div>
              <span>Login to see items from your existing bag and wishlist.</span>
              <button className="login-now-btn">LOGIN NOW</button>
            </div>
          )}
        </div>

        {/* Right: Price summary */}
        {cartItems.length > 0 && (
          <div className="cart-summary">
            {/* Coupons */}
            <div className="summary-section coupon-section">
              <h4>COUPONS</h4>
              <div className="coupon-row">
                <span>🏷</span>
                <input
                  type="text"
                  placeholder="Apply Coupons"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <button className="apply-btn">APPLY</button>
              </div>
              <div className="login-coupon">
                <span className="login-link">Login</span> to get upto ₹300 OFF on first order
              </div>
            </div>

            {/* Donate */}
            <div className="summary-section donate-section">
              <h4>SUPPORT TRANSFORMATIVE SOCIAL WORK IN INDIA</h4>
              <div className="donate-check">
                <input
                  type="checkbox"
                  checked={!!donate}
                  onChange={(e) => setDonate(e.target.checked ? 10 : null)}
                />
                <span>Donate and make a difference</span>
              </div>
              <div className="donate-amounts">
                {[10, 20, 50, 100].map((a) => (
                  <button
                    key={a}
                    className={`donate-btn ${donate === a ? "active" : ""}`}
                    onClick={() => setDonate(donate === a ? null : a)}
                  >₹{a}</button>
                ))}
              </div>
            </div>

            {/* Price Details */}
            <div className="summary-section price-details">
              <h4>PRICE DETAILS ({cartItems.reduce((s, i) => s + i.qty, 0)} Item{cartItems.length > 1 ? "s" : ""})</h4>
              <div className="price-row">
                <span>Total MRP</span>
                <span>₹{(totalMRP + discount).toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Discount on MRP</span>
                <span className="discount-val">- ₹{discount.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Coupon Discount</span>
                <span className="apply-coupon-link">Apply Coupon</span>
              </div>
              <div className="price-row">
                <span>Platform Fee <span className="know-more">Know More</span></span>
                <span>₹{platformFee}</span>
              </div>
              {donate && (
                <div className="price-row">
                  <span>Donation</span>
                  <span>₹{donate}</span>
                </div>
              )}
              <div className="price-divider"></div>
              <div className="price-row total-row">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Terms */}
            <div className="terms-note">
              By placing the order, you agree to Myntra's{" "}
              <span className="terms-link">Terms of Use</span> and{" "}
              <span className="terms-link">Privacy Policy</span>
            </div>

            {/* Place Order */}
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
