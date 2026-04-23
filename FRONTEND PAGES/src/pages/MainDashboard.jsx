
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { LogOut } from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "products", icon: "🗂", label: "Products" },
  { id: "lowstock", icon: "⚠", label: "Low Stock"},
  { id: "orders", icon: "📋", label: "Orders" },
  { id: "analytics", icon: "📈", label: "Analytics" },
  { id: "Logout", icon: "🚪", label: "Logout" }
   
  
];



export default function MainDashboard() {
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
const [lowStockCount, setLowStockCount] = useState(0);
const [dealerName, setDealerName] = useState("");
/*function MainDashboard() {

  const navigate = useNavigate();   // ✅ ADD THIS

  useEffect(() => {
    const dealerId = localStorage.getItem("dealerId");

    // ❌ if not logged in
    if (!dealerId) {
      navigate("/login");
      return;
    }

    // 🔥 check onboarding status
    fetch(`http://localhost:8087/api/dealer/${dealerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.onboardingStep <= 4) {
          navigate("/onboarding");   // ⛔ block dashboard
        }
      });
      
  }, [navigate]);   // ✅ include navigate

  // your existing code below...
}*/
useEffect(() => {
  const path = window.location.pathname;

  // ✅ Only run auth check on dashboard "/"
  if (path !== "/") return;

 const dealerId = localStorage.getItem("dealerId");
  const token = localStorage.getItem("token");

  if (!dealerId) {
    navigate("/login");
    return;
  }

  fetch(`http://localhost:8087/api/dealer/${dealerId}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.onboardingStep <= 4) {
        navigate("/onboarding");
      }
    })
    .catch(err => {
      console.error("Auth check failed:", err);
      // ❌ Do NOT navigate to login on error
    });

}, [navigate]);
useEffect(() => {
  const name = localStorage.getItem("dealerName");
  console.log("Dealer from storage:", name);

  setDealerName(name);
}, []);


// ✅ ADD HERE
const STATS = [
  {
    icon: "📦",
    value: products.length,
    label: "Total Products",
    delta: "+2 this week",
    color: "amber"
  },
  {
    icon: "⚠",
    value: lowStockCount,
    label: "Low Stock Alerts",
    delta: "Action needed",
    color: "warn"
  },
  {
    icon: "💰",
    value: "₹5,000",
    label: "Total Revenue",
    delta: "+12% vs last month",
    color: "green"
  }
];
  const dealerId = Number(localStorage.getItem("dealerId"));
 const [form, setForm] = useState({
  name: "",
  price: "",
  description: "",
  stock: "",
  discount: "",
  image: null
});

const loadLowStockCount = async () => {
  try {
    const res = await fetch(
      `http://localhost:8087/product/lowstock/${dealerId}`,
      {
headers: {
    Authorization: `Bearer ${token}`   // ✅ MUST
  }
      }
    );

    const data = await res.json();
    setLowStockCount(data.length);

  } catch (err) {
    console.error(err);
  }
};

 useEffect(() => {
  //if (!dealerId) {
    //alert("Please login again");
    //navigate("/login");
  //} else {
    loadProducts();
     loadLowStockCount(); 
  
}, []);


  const handleAdd = async () => {
  try {
    const dealerId = localStorage.getItem("dealerId");

    if (!dealerId) {
      alert("Please login again");
      return;
    }

    const formData = new FormData();

    formData.append("productName", form.name);
    formData.append("price", Number(form.price));
    formData.append("description", form.description);
    formData.append("quantity", Number(form.stock));
    formData.append("discount", Number(form.discount)); 
    formData.append("dealerId", Number(dealerId));
    formData.append("file", form.image);
const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8087/product/addWithImage", {
      method: "POST",
       headers: {
    Authorization: `Bearer ${token}`   // ✅ MUST
  },
      body: formData
    });

    const msg = await res.text();

    if (!res.ok) {
      throw new Error(msg);
    }

    alert(msg);

    // reset form
    setForm({
      name: "",
      price: "",
      description: "",
      stock: "",
      image: null
    });

    loadProducts(); 
    loadLowStockCount();// refresh table

  } catch (err) {
    console.error(err);
    alert("Error adding product");
  }
};
const token = localStorage.getItem("token");
    const loadProducts = async () => {
  try {
    const dealerId = localStorage.getItem("dealerId");

    const res = await fetch(
      `http://localhost:8087/product/dealer/${dealerId}`,{
        headers: {
    "Authorization": `Bearer ${token}`
  }

      }

      
    );

    const data = await res.json();

    const formatted = data.map(p => ({
      id: p.productId,
      name: p.productName,
      price: p.price,
      stock: p.quantity,
      status:
        p.quantity === 0
          ? "out"
          : p.quantity < 5
          ? "low"
          : "active"
    }));

    setProducts(formatted);

  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="db-root">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-sidebar-brand">
          <div className="db-logo-mark">I</div>
          <div>
            <div className="db-brand-name">Instabuy</div>
            <div className="db-brand-sub">Seller Space</div>
          </div>
        </div>
        <nav className="db-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`db-nav-item${active === item.id ? " db-nav-item--active" : ""}`}
              onClick={() => {
  setActive(item.id);

  const routes = {
    dashboard: "/",
    products: "/products",
    lowstock: "/lowstock",
    orders: "/orders",
    analytics: "/analytics",
    Logout:"/login"
  };

  navigate(routes[item.id]);
}}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {item.badge && <span className="db-nav-badge">{item.badge}</span>}
            </button>
          ))}
       
  
        </nav>

       
        

      <div className="db-sidebar-footer">
  <div className="db-user-card" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
    <div className="db-user-avatar">
      {(localStorage.getItem("dealerName") || "D")[0]}
    </div>
    <div>
      <div className="db-user-name">
        {localStorage.getItem("dealerName") || "Dealer"}
      </div>
      <div className="db-user-role">Seller</div>
    </div>
  </div>
</div>
      </aside>

      {/* Main */}
      <main className="db-main">
        {/* Header */}
        <header className="db-header">
          <div>
            <h1 className="db-page-title">
  Welcome back, {localStorage.getItem("dealerName") || "Dealer"} 👋
</h1>
            <p className="db-page-sub">Manage your products and inventory</p>
          </div>
          <div className="db-header-right">
            <div className="db-search">
              <span className="db-search-icon">🔍</span>
              <input placeholder="Search products..." className="db-search-input" />
            </div>
            <button className="db-notify-btn">🔔<span className="db-notify-dot" /></button>
          </div>
        </header>

        <div className="db-content">
          {/* Stats */}
          <div className="db-stats-row">
            {STATS.map(s => (
              <div key={s.label} className={`db-stat-card db-stat-card--${s.color}`}>
                <div className="db-stat-header">
                  <span className="db-stat-icon">{s.icon}</span>
                  <span className={`db-stat-delta db-stat-delta--${s.color}`}>{s.delta}</span>
                </div>
                <div className="db-stat-value">{s.value}</div>
                <div className="db-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="db-grid-two">
            {/* Add Product */}
            <div className="db-card">
              <div className="db-card-head">
                <div>
                  <h2 className="db-card-title">Add New Product</h2>
                  <p className="db-card-sub">Fill details to add to your inventory</p>
                </div>
                <span className="db-card-icon">＋</span>
              </div>
              <div className="db-form">
                <div className="db-input-wrap">
                  <label>Product Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Wireless Earbuds"
                  />
                </div>
                <div className="db-input-row">
                  <div className="db-input-wrap">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="999"
                    />
                  </div>
                  <div className="db-input-wrap">
                    <label>Stock Qty</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="db-input-wrap">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Short product description..."
                    rows={3}
                  />
                  <div className="db-input-wrap">
  <label>Discount (%)</label>
  <input
    type="number"
    value={form.discount}
    onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
    placeholder="0"
  />
</div>
                  <div className="db-input-wrap">
  <label>Product Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setForm(f => ({ ...f, image: e.target.files[0] }))
    }
  />
</div>
                </div>
                <button className="db-btn-submit" onClick={handleAdd}>Add to Inventory →</button>
              </div>
            </div>

            {/* Product Table */}
            <div className="db-card">
              <div className="db-card-head">
                <div>
                  <h2 className="db-card-title">Recent Products</h2>
                  <p className="db-card-sub">{products.length} items in inventory</p>
                </div>
                <span 
  style={{ cursor: "pointer", color: "#c47b2a", fontWeight: "500" }}
  onClick={() => navigate("/products")}
>
  View all →
</span>
              </div>
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="db-td-name">{p.name}</td>
                        <td>₹{p.price.toLocaleString()}</td>
                        <td>{p.stock}</td>
                        <td>
                          <span className={`db-badge db-badge--${p.status}`}>
                            {p.status === "active" ? "In Stock" : p.status === "low" ? "Low Stock" : "Out"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
