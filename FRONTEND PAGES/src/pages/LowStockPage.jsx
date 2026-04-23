import { useEffect, useState } from "react";
import axios from "axios";
import "./LowStockPage.css";

const API = "http://localhost:8087";

export default function LowStockPage() {
  const dealerId = localStorage.getItem("dealerId");

  // ✅ FIX 1: DEFINE STATE
  const [products, setProducts] = useState([]);
const token = localStorage.getItem("token");
  // ✅ LOAD LOW STOCK PRODUCTS
  const loadLowStock = async () => {
    try {
      const res = await axios.get(
        `${API}/product/lowstock/${dealerId}`,{
          headers: {
    Authorization: `Bearer ${token}`   // ✅ MUST
  }
        }
          
        
        
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIX 2: USE EFFECT
  useEffect(() => {
    if (dealerId) {
      loadLowStock();
    }
  }, [dealerId]);

  return (
    <div className="lowstock-page">
      <div className="topbar">
  <p className="topbar-text">
    Manage your inventory — grow your business 🚀
  </p>
</div>


<div className="navbar">

  <h2 className="brand">DealerHub</h2>


  <div className="nav-links">
    <span onClick={() => window.location.href="/dashboard"}>Dashboard</span>
    <span onClick={() => window.location.href="/products"}>Products</span>
    
    <span style={{ fontWeight: "bold" }}>Low Stock</span>
    <span>Reports</span>
  </div>

  <div className="nav-right">
    <span>Welcome, {JSON.parse(localStorage.getItem("dealer"))?.name}</span>
    <span>🔔</span>
    <span
      style={{ cursor: "pointer" }}
      onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}
    >
      
    </span>
  </div>

</div>

     <h3 className="section-title">Low Stock Products</h3>

      {products.length === 0 ? (
        <div className="lowstock-empty">No low stock products 🎉</div>
      ) : (
        <div className="lowstock-grid">

          {products.map((p) => (
            <div className="lowstock-card" key={p.productId}>

              <div className="lowstock-badge">LOW STOCK</div>

              <img
                src={
  p.imageUrl
    ? `${API}/uploads/${p.imageUrl}`
    : "https://via.placeholder.com/300"
}
                alt=""
              />

              <h4>{p.productName}</h4>

              <div className="lowstock-price">₹{p.price}</div>

              <div className="lowstock-qty">
                {p.quantity} units left
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}