import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

const API_BASE = "http://localhost:8087"; // adjust to your backend URL

// ─── Step Indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current }) {
  const steps = [
    { id: 1, label: "Business Details" },
    { id: 2, label: "Pickup Address" },
    { id: 3, label: "Bank Details" },
    { id: 4, label: "Supplier Details" },
  ];
  return (
    <div className="ob-step-indicator">
      {steps.map((s, i) => (
        <div key={s.id} className="ob-step-item">
          <div className={`ob-step-circle ${current > s.id ? "done" : current === s.id ? "active" : ""}`}>
            {current > s.id ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              s.id
            )}
          </div>
          <span className={`ob-step-label ${current === s.id ? "active" : ""}`}>{s.label}</span>
          {i < steps.length - 1 && <div className={`ob-step-line ${current > s.id ? "done" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── FAQ Panel ─────────────────────────────────────────────────────────────────
function FAQPanel({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="ob-faq">
      <div className="ob-faq-badge">
        <span>👥</span>
        <p>More than 100,000 suppliers are growing their business by selling on DealerHub</p>
      </div>
      <h3>Frequently Asked Questions</h3>
      {items.map((item, i) => (
        <div key={i} className={`ob-faq-item ${open === i ? "open" : ""}`}>
          <button onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <span className="ob-faq-chevron">{open === i ? "∧" : "∨"}</span>
          </button>
          {open === i && <p>{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

// ─── EID Modal ─────────────────────────────────────────────────────────────────
function EIDModal({ onClose, onSuccess }) {
  const [phase, setPhase] = useState("form"); // form | submitting | otp | success
  const [form, setForm] = useState({
    pan: "", name: "", email: "", state: "", pincode: "",
    district: "", city: "", room: "", street: "", captcha: "",
  });
  const [otp, setOtp] = useState({ mobile: ["","","","","",""], email: ["","","","","",""] });
  const [eid, setEid] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    setPhase("submitting");
    try {
      const token = localStorage.getItem("token");
      console.log("Sending:", {
  step: 1,
  ...form
});
const dealerId = localStorage.getItem("dealerId");

if (!dealerId) {
  alert("Dealer ID missing");
  return;
}
      const res = await fetch(`${API_BASE}/api/dealer/update-step/${localStorage.getItem("dealerId")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
  step: 1,
  pan: form.pan?.trim(),
  name: form.name?.trim(),
  phone: form.phone?.trim()
})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create EID");
      setEid(data.eid || "");
      setPhase("otp");
    } catch (err) {
      setError(err.message);
      setPhase("form");
    }
  };

  const handleOtpChange = (type, idx, val) => {
    const arr = [...otp[type]];
    arr[idx] = val.slice(-1);
    setOtp({ ...otp, [type]: arr });
    if (val && idx < 5) document.getElementById(`otp-${type}-${idx + 1}`)?.focus();
  };

  const handleVerifyOtp = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/dealer/update-step/${localStorage.getItem("dealerId")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
  step: 1,   // ✅ ADD THIS
  mobileOtp: otp.mobile.join(""),
  emailOtp: otp.email.join(""),
  pan: form.pan
}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setPhase("success");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="ob-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ob-modal">
        <button className="ob-modal-close" onClick={onClose}>✕</button>
        <h2>Create your EID</h2>

        {phase !== "success" && (
          <div className="ob-modal-steps">
            <div className={`ob-modal-step ${phase === "form" || phase === "submitting" ? "active" : "done"}`}>
              <span>1</span> Add Details
            </div>
            <div className="ob-modal-step-line" />
            <div className={`ob-modal-step ${phase === "otp" ? "active" : ""}`}>
              <span>2</span> Verify OTP
            </div>
          </div>
        )}

        {error && <p className="ob-error">{error}</p>}

        {phase === "form" && (
          <form onSubmit={handleSubmitForm}>
            <p className="ob-modal-section-title">PAN and Contact Details</p>
            <div className="ob-modal-row">
              <input name="pan" placeholder="PAN Number" value={form.pan} onChange={handleChange} required />
              <input name="name" placeholder="Name as per PAN" value={form.name} onChange={handleChange} required />
            </div>
            
            <p className="ob-modal-section-title">Address Details</p>
            <div className="ob-modal-row">
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
              <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
            </div>
            <div className="ob-modal-row">
              <input name="district" placeholder="District" value={form.district} onChange={handleChange} required />
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
            </div>
            <div className="ob-modal-row">
              <input name="room" placeholder="Room/Floor/Building Number" value={form.room} onChange={handleChange} />
              <input name="street" placeholder="Street/Locality/Landmark" value={form.street} onChange={handleChange} />
            </div>

            <p className="ob-modal-section-title">Captcha Security Check</p>
            <div className="ob-captcha-row">
              <div className="ob-captcha-img">🔒 CAPTCHA</div>
              <input name="captcha" placeholder="Type the characters" value={form.captcha} onChange={handleChange} required />
            </div>

            <button type="submit" className="ob-btn-primary">Submit Details</button>
          </form>
        )}

        {phase === "submitting" && (
          <div className="ob-submitting">
            <div className="ob-submitting-icons">
              <span className="ob-brand-icon">D</span>
              <span className="ob-arrow">→</span>
              <span className="ob-gst-icon">GST</span>
            </div>
            <h3>Submitting your details</h3>
            <p>Do not refresh or close the page. We are submitting your details to the GST website.</p>
          </div>
        )}

        {phase === "otp" && (
          <div className="ob-otp-phase">
            <div className="ob-otp-group">
              <label>Enter the OTP sent to your mobile number</label>
              <div className="ob-otp-boxes">
                {otp.mobile.map((v, i) => (
                  <input key={i} id={`otp-mobile-${i}`} maxLength={1} value={v}
                    onChange={(e) => handleOtpChange("mobile", i, e.target.value)}
                    onKeyDown={(e) => e.key === "Backspace" && !v && i > 0 && document.getElementById(`otp-mobile-${i-1}`)?.focus()}
                  />
                ))}
              </div>
            </div>
            <div className="ob-otp-group">
              <label>Enter the OTP sent to your email ID</label>
              <div className="ob-otp-boxes">
                {otp.email.map((v, i) => (
                  <input key={i} id={`otp-email-${i}`} maxLength={1} value={v}
                    onChange={(e) => handleOtpChange("email", i, e.target.value)}
                    onKeyDown={(e) => e.key === "Backspace" && !v && i > 0 && document.getElementById(`otp-email-${i-1}`)?.focus()}
                  />
                ))}
              </div>
            </div>
            <p className="ob-resend">Didn't get OTP? <button onClick={() => {}}>Resend OTP</button></p>
            <button className="ob-btn-primary" onClick={handleVerifyOtp}>Submit</button>
          </div>
        )}

        {phase === "success" && (
          <div className="ob-success-phase">
            <div className="ob-success-icon">✅</div>
            <h3>Enrolment ID created successfully</h3>
            <p>Details have been sent to your email ID</p>
            <button className="ob-btn-primary" onClick={() => onSuccess(eid)}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 1: Business Details ───────────────────────────────────────────────────
function Step1({ onNext }) {
  const [hasGST, setHasGST] = useState(null);
  const [gstin, setGstin] = useState("");
  const [showEIDModal, setShowEIDModal] = useState(false);
  const [eid, setEid] = useState("");
  const [existingEid, setExistingEid] = useState("");
  const [showExisting, setShowExisting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = hasGST
  ? {
      step: 1,
      gstNumber: gstin
    }
  : {
      step: 1,
      eid: eid || existingEid
    };
    console.log("DealerId:", localStorage.getItem("dealerId"));
      const res = await fetch(`${API_BASE}/api/dealer/update-step/${localStorage.getItem("dealerId")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save business details");
      onNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const faqItems = [
    { q: "Which sellers can sell on DealerHub?", a: "Starting October 1st, 2023, sellers (with or without GST registration) can sell on DealerHub. Non-GST sellers must obtain an Enrolment ID/UIN from the GST website." },
    { q: "How can I obtain GSTIN No or Enrolment ID / UIN?", a: "You can register on the GST portal at gst.gov.in. For GSTIN, complete the full GST registration. For Enrolment ID, use the Taxpayers section for non-taxable persons." },
    { q: "What is the difference between Enrolment ID / UIN and GSTIN?", a: "GSTIN is for businesses above the turnover threshold. Enrolment ID/UIN is for small businesses and non-taxable persons who still need to sell online." },
  ];

  return (
    <div className="ob-main-layout">
      <div className="ob-left-panel">
        <h2>Do you have a GST number?</h2>

        <div className="ob-gst-options">
          <label className={`ob-gst-card ${hasGST === true ? "selected" : ""}`} onClick={() => setHasGST(true)}>
            <input type="radio" name="gst" checked={hasGST === true} readOnly />
            <div>
              <strong>Yes</strong>
              <p>Enter your GSTIN and sell anywhere easily</p>
            </div>
          </label>
          <label className={`ob-gst-card ${hasGST === false ? "selected" : ""}`} onClick={() => setHasGST(false)}>
            <input type="radio" name="gst" checked={hasGST === false} readOnly />
            <div>
              <strong>No</strong>
              <p>Worry not, you can sell without GST</p>
              <span className="ob-eid-badge">Get EID in mins ⚡</span>
            </div>
          </label>
        </div>

        {hasGST === true && (
          <div className="ob-gstin-form">
            <input
              type="text"
              placeholder="Enter your GSTIN"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              maxLength={15}
            />
            {error && <p className="ob-error">{error}</p>}
            <button className="ob-btn-primary" onClick={handleSubmit} disabled={!gstin || loading}>
              {loading ? "Saving..." : "Proceed"}
            </button>
          </div>
        )}

        {hasGST === false && (
          <div className="ob-no-gst-panel">
            <div className="ob-no-gst-header">
              <strong>Sell without GST in minutes</strong>
              <span>∧</span>
            </div>
            <p>We only need the below details from you to create your enrolment ID</p>
            <ul className="ob-eid-checklist">
              {["PAN number", "Full Name", "Email ID", "Full Address"].map((item) => (
                <li key={item}><span className="ob-check">✓</span> {item}</li>
              ))}
            </ul>
            <p className="ob-terms-note">
              By proceeding and providing your details, you confirm that you've read and agreed to the{" "}
              <button type="button" className="ob-link-btn">T&C</button> and authorize DealerHub to apply for an enrollment ID on your behalf.
            </p>

            {eid ? (
              <div className="ob-eid-success-inline">
                <span className="ob-check">✓</span> EID Created: <strong>{eid}</strong>
              </div>
            ) : (
              <button className="ob-btn-primary" onClick={() => setShowEIDModal(true)}>
                Proceed to add details
              </button>
            )}

            <p className="ob-or-divider">Or create it directly through the <button type="button" className="ob-link-btn">GST website ↗</button></p>

            <div className="ob-existing-eid-toggle" onClick={() => setShowExisting(!showExisting)}>
              <span>Add existing enrolment ID</span>
              <span>{showExisting ? "∧" : "∨"}</span>
            </div>
            {showExisting && (
              <div className="ob-existing-eid-form">
                <input
                  type="text"
                  placeholder="Enter your Enrolment ID"
                  value={existingEid}
                  onChange={(e) => setExistingEid(e.target.value)}
                />
              </div>
            )}

            {error && <p className="ob-error">{error}</p>}
            {(eid || existingEid) && (
              <button className="ob-btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Continue"}
              </button>
            )}
          </div>
        )}
      </div>

      <FAQPanel items={faqItems} />

      {showEIDModal && (
        <EIDModal
          onClose={() => setShowEIDModal(false)}
          onSuccess={(createdEid) => {
            setEid(createdEid);
            setShowEIDModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─── STEP 2: Pickup Address ─────────────────────────────────────────────────────
function Step2({ onNext, onBack }) {
  const [form, setForm] = useState({
    contactName: "", phone: "", pincode: "", address: "", city: "", state: "", landmark: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
     
      const res = await fetch(`${API_BASE}/api/dealer/update-step/${localStorage.getItem("dealerId")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
  step: 2,
  address: form.address,
  city: form.city,
  state: form.state
})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save address");
      onNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    { q: "What is the Pickup Address?", a: "The pickup address is where our logistics partner will come to collect your orders. Make sure this is accurate and accessible." },
    { q: "Can I add multiple pickup addresses?", a: "Yes, you can add multiple pickup addresses after completing registration from your seller dashboard." },
    { q: "How do I verify my pickup address?", a: "We may verify the address by sending an OTP to your registered mobile number." },
  ];

  return (
    <div className="ob-main-layout">
      <div className="ob-left-panel">
        <h2>Add Pickup Address</h2>
        <p className="ob-subtitle">Enter the address from where your orders will be picked up</p>

        <div className="ob-form-grid">
          <input name="contactName" placeholder="Contact Person Name" value={form.contactName} onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} type="tel" />
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="ob-full-width" />
          <input name="address" placeholder="Flat/House No, Building, Street" value={form.address} onChange={handleChange} className="ob-full-width" />
          <input name="landmark" placeholder="Landmark (Optional)" value={form.landmark} onChange={handleChange} className="ob-full-width" />
        </div>

        {error && <p className="ob-error">{error}</p>}
        <div className="ob-btn-row">
          <button className="ob-btn-secondary" onClick={onBack}>Back</button>
          <button className="ob-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>

      <FAQPanel items={faqItems} />
    </div>
  );
}

// ─── STEP 3: Bank Details ───────────────────────────────────────────────────────
function Step3({ onNext, onBack }) {
  const [form, setForm] = useState({ accountNumber: "", confirmAccount: "", ifsc: "" });
  const [verified, setVerified] = useState(null); // null | { beneficiaryName, bankName, ... }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleVerify = async () => {
    setError("");
    if (form.accountNumber !== form.confirmAccount) {
      setError("Account numbers do not match");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/dealer/update-step/${localStorage.getItem("dealerId")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
  step: 3,
  accountNumber: form.accountNumber,
  ifscCode: form.ifsc   // ✅ IMPORTANT FIX
})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bank verification failed");
      setVerified(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    { q: "What if I don't have a bank account in the name of business?", a: "We can only transfer payments to accounts in the registered business name. Please open a new bank account with any bank in your registered business name." },
    { q: "How and when do I get paid?", a: "Payments are processed weekly. Funds are transferred to your bank account every Monday for orders delivered the previous week." },
    { q: "Are my bank details safe?", a: "Yes, your bank details are encrypted and stored securely. We never share your financial information with third parties." },
  ];

  return (
    <div className="ob-main-layout">
      <div className="ob-left-panel">
        <div className="ob-payment-badge">
          <span>₹</span> Payments are deposited safely in your bank account on time
        </div>

        {!verified ? (
          <>
            <div className="ob-bank-notice">
              ⚠️ Bank account should be in the name as per Enrolment ID / UIN
            </div>
            <div className="ob-form-grid">
              <input name="accountNumber" placeholder="Account Number" value={form.accountNumber} onChange={handleChange} className="ob-full-width" type="password" />
              <input name="confirmAccount" placeholder="Confirm Account Number" value={form.confirmAccount} onChange={handleChange} className="ob-full-width" />
              <input name="ifsc" placeholder="IFSC Code" value={form.ifsc} onChange={handleChange} className="ob-full-width" />
            </div>
            <p className="ob-ifsc-link">Don't remember IFSC Code? <button type="button" className="ob-link-btn">Find IFSC Code</button></p>
            {error && <p className="ob-error">{error}</p>}
            <div className="ob-btn-row">
              <button className="ob-btn-secondary" onClick={onBack}>Back</button>
              <button className="ob-btn-primary" onClick={handleVerify} disabled={loading}>
                {loading ? "Verifying..." : "Verify Bank Details"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="ob-bank-verified">✓ Bank details verified successfully</div>
            <div className="ob-bank-info">
              <div><span>Beneficiary Name</span><strong>{verified.beneficiaryName || "••••••"}</strong></div>
              <div><span>Account Number</span><strong>{verified.accountNumber || "••••••••••"}</strong></div>
              <div><span>Bank Name</span><strong>{verified.bankName || "••••••"}</strong></div>
              <div><span>IFSC Code</span><strong>{verified.ifsc || "••••••••••"}</strong></div>
            </div>
            {error && <p className="ob-error">{error}</p>}
            <div className="ob-btn-row">
              <button className="ob-btn-secondary" onClick={onBack}>Back</button>
              <button className="ob-btn-primary" onClick={onNext}>Continue</button>
            </div>
          </>
        )}
      </div>

      <FAQPanel items={faqItems} />
    </div>
  );
}

// ─── STEP 4: Supplier Details ───────────────────────────────────────────────────
function Step4({ onNext, onBack }) {
  const [form, setForm] = useState({ storeName: "", fullName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/dealer/update-step/${localStorage.getItem("dealerId")}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
  step: 4,
  storeName: form.storeName,
  fullName: form.fullName
})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save supplier details");
      onNext();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    { q: "What is Store Name?", a: "Your Store Name is how buyers will identify you on DealerHub. You can use Store Name to build your brand identity." },
    { q: "Can I change my Store Name later?", a: "Yes, you can update your Store Name from the Seller Settings section of your dashboard." },
    { q: "Does the Full Name need to match my legal documents?", a: "Yes, please ensure your Full Name matches the name on your PAN card or Enrolment ID." },
  ];

  return (
    <div className="ob-main-layout">
      <div className="ob-left-panel">
        <div className="ob-store-notice">
          ℹ️ Your store name will be visible to all buyers of DealerHub.
        </div>
        <div className="ob-form-grid">
          <input
            name="storeName"
            placeholder="Store Name"
            value={form.storeName}
            onChange={handleChange}
            className="ob-full-width"
          />
          <p className="ob-input-hint">Eg. Business Name, Trade Name, etc.</p>
          <input
            name="fullName"
            placeholder="Your Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="ob-full-width"
          />
        </div>
        {error && <p className="ob-error">{error}</p>}
        <div className="ob-btn-row">
          <button className="ob-btn-secondary" onClick={onBack}>Back</button>
          <button className="ob-btn-primary" onClick={handleSubmit} disabled={!form.storeName || !form.fullName || loading}>
            {loading ? "Completing..." : "Complete Registration"}
          </button>
        </div>
      </div>

      <FAQPanel items={faqItems} />
    </div>
  );
}

// ─── Main Onboarding Component ──────────────────────────────────────────────────
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

 useEffect(() => {
  //const token = localStorage.getItem("token");
  //if (!token) navigate("/login");
}, [navigate]);

 const handleComplete = async () => {
  const dealerId = localStorage.getItem("dealerId");

  try {
    const res = await fetch(`http://localhost:8087/api/dealer/${dealerId}`);
    const updatedDealer = await res.json();

    localStorage.setItem("dealerId", updatedDealer.dealerId);
    localStorage.setItem("dealerName", updatedDealer.name);
    localStorage.setItem("dealer", JSON.stringify(updatedDealer));

    navigate("/dashboard");

  } catch (err) {
    console.error("Error updating dealer:", err);
    navigate("/dashboard");
  }
};
  return (
    <div className="ob-container">
      {/* Header */}
      <div className="ob-header">
        <div className="ob-logo">
          <span className="ob-logo-icon">D</span>
          <span className="ob-logo-text">DealerHub</span>
        </div>
        <StepIndicator current={step} />
      </div>

      {/* Content */}
      <div className="ob-content">
        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <Step3 onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <Step4 onNext={handleComplete} onBack={() => setStep(3)} />}
      </div>
    </div>
  );
}
