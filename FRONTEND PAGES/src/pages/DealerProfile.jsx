import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DealerProfile.css";

export default function DealerProfile() {
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("dealer");
    if (!stored) {
      navigate("/login");
      return;
    }
    setDealer(JSON.parse(stored));
  }, [navigate]);

  if (!dealer) return null;

  const initials = dealer.name
    ? dealer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "D";

  const infoCards = [
    { label: "Full Name", value: dealer.name, icon: "👤" },
    { label: "Email Address", value: dealer.email, icon: "✉️" },
    { label: "Phone Number", value: dealer.phone, icon: "📞" },
    { label: "Company Name", value: dealer.company, icon: "🏢" },
    { label: "Store Name", value: dealer.storeName || dealer.store_name, icon: "🏪" },
    { label: "GST / EID", value: dealer.gstin || dealer.eid || dealer.enrolmentId, icon: "📋" },
    { label: "Member Since", value: dealer.createdAt ? new Date(dealer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—", icon: "📅" },
    { label: "Account Status", value: dealer.status || "Active", icon: "✅" },
  ].filter((c) => c.value);

  return (
    <div className="dp-container">
      {/* Sidebar matches dashboard */}
      <aside className="dp-sidebar">
        <div className="dp-sidebar-brand">
          <span className="dp-sidebar-icon">I</span>
          <div>
            <p className="dp-sidebar-name">Instabuy</p>
            <p className="dp-sidebar-sub">Seller Space</p>
          </div>
        </div>

        <nav className="dp-sidebar-nav">
          {[
            { label: "Dashboard", icon: "⊞", path: "/dashboard" },
            { label: "Products", icon: "📦", path: "/products" },
            { label: "Low Stock", icon: "⚠️", path: "/lowstock" },
            { label: "Orders", icon: "📋", path: "#" },
            { label: "Analytics", icon: "📊", path: "#" },
          ].map((item) => (
            <button key={item.label} className="dp-nav-item" onClick={() => navigate(item.path)}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="dp-sidebar-dealer active">
          <div className="dp-avatar">{initials}</div>
          <div>
            <p className="dp-dealer-name">{dealer.name || "Dealer"}</p>
            <p className="dp-dealer-role">Seller</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="dp-main">
        {/* Header */}
        <div className="dp-header">
          <button className="dp-back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

        {/* Profile Hero */}
        <div className="dp-hero">
          <div className="dp-hero-avatar">
            <span>{initials}</span>
          </div>
          <div className="dp-hero-info">
            <h1>{dealer.name || "Dealer"}</h1>
            <p>{dealer.company || dealer.storeName || "Seller"}</p>
            <span className="dp-status-badge">● Active Seller</span>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="dp-section-title">Account Information</div>
        <div className="dp-cards-grid">
          {infoCards.map((card) => (
            <div className="dp-card" key={card.label}>
              <div className="dp-card-icon">{card.icon}</div>
              <div className="dp-card-content">
                <span className="dp-card-label">{card.label}</span>
                <span className="dp-card-value">{card.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Onboarding Details */}
        {(dealer.pickupAddress || dealer.bankDetails || dealer.supplierDetails) && (
          <>
            <div className="dp-section-title">Business Details</div>
            <div className="dp-cards-grid">
              {dealer.pickupAddress && (
                <div className="dp-card dp-card-wide">
                  <div className="dp-card-icon">📍</div>
                  <div className="dp-card-content">
                    <span className="dp-card-label">Pickup Address</span>
                    <span className="dp-card-value">
                      {[dealer.pickupAddress.address, dealer.pickupAddress.city, dealer.pickupAddress.state, dealer.pickupAddress.pincode].filter(Boolean).join(", ")}
                    </span>
                  </div>
                </div>
              )}
              {dealer.bankDetails && (
                <div className="dp-card">
                  <div className="dp-card-icon">🏦</div>
                  <div className="dp-card-content">
                    <span className="dp-card-label">Bank</span>
                    <span className="dp-card-value">{dealer.bankDetails.bankName || "Verified"}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="dp-actions">
          <button className="dp-btn-outline" onClick={() => navigate("/onboarding")}>
            ✏️ Edit Profile
          </button>
          <button className="dp-btn-danger" onClick={() => { localStorage.clear(); navigate("/login"); }}>
            🚪 Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
