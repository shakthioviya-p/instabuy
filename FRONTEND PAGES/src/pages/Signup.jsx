import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
  const res = await axios.post("http://localhost:8087/api/dealer/signup", {
    name: formData.name || "",
    email: formData.email || "",
    phone: formData.phone || "",
    company: formData.company || "",
    password: formData.password || "",
  });

  // ✅ Save dealerId from returned Dealer object
  localStorage.setItem("dealerId", res.data.dealerId);
  localStorage.setItem("dealerName", res.data.name || "");

  // ✅ Now login to get token
  const loginRes = await axios.post("http://localhost:8087/api/dealer/login", {
    email: formData.email,
    password: formData.password,
  });

  const token = loginRes.data.token;
  localStorage.setItem("token", token);

  // ✅ Decode dealerId from token as backup
  const payload = JSON.parse(atob(token.split('.')[1]));
  localStorage.setItem("dealerId", payload.dealerId);

  navigate("/onboarding");
} catch {
  setError("Registration failed. Please try again.");
} finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: "user" },
    { id: "email", label: "Email Address", type: "email", placeholder: "dealer@company.com", icon: "mail" },
    { id: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000", icon: "phone" },
    { id: "company", label: "Company Name", type: "text", placeholder: "Your Company LLC", icon: "building" },
  ];

  const benefits = [
    { icon: "zap", title: "Instant Access", description: "Get immediate access to exclusive inventory" },
    { icon: "shield", title: "Secure Platform", description: "Your data is protected with enterprise security" },
    { icon: "headphones", title: "24/7 Support", description: "Dedicated dealer support team always available" },
    { icon: "trending", title: "Growth Tools", description: "Analytics and insights to grow your business" },
  ];

  const renderIcon = (iconName, className = "") => {
    const icons = {
      user: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      mail: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>,
      phone: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
      building: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
      lock: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
      zap: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      shield: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      headphones: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
      trending: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
      check: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    };
    return icons[iconName] || null;
  };

  return (
    <div className="signup-container">
      {/* LEFT SIDE - Signup Form */}
      <div className={`signup-left ${mounted ? "mounted" : ""}`}>
        <div className="signup-box">
          {/* Particles */}
          <div className="particles">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="particle" style={{ left: `${15 + i * 15}%`, top: `${10 + (i % 3) * 30}%`, animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>

          {/* Logo */}
          <div className={`logo-section ${mounted ? "mounted" : ""}`}>
            <div className="logo-wrapper">
              <div className="logo-icon"><span>D</span></div>
              <div className="logo-text">
                <span className="brand-name">DealerHub</span>
                <span className="brand-tagline">
                  <svg className="sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                  </svg>
                  Create Your Account
                </span>
              </div>
            </div>
            <p className="login-subtitle">Join thousands of dealers and start growing your business today.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="signup-form">
            {error && <div className="error-message">{error}</div>}

            {inputFields.map((field, index) => (
              <div key={field.id} className={`form-group ${mounted ? "mounted" : ""}`} style={{ transitionDelay: `${100 + index * 50}ms` }}>
                <label className={focusedField === field.id ? "focused" : ""}>{field.label}</label>
                <div className="input-wrapper">
                  <div className={`input-glow ${focusedField === field.id ? "active" : ""}`} />
                  {renderIcon(field.icon, `input-icon ${focusedField === field.id ? "focused" : ""}`)}
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    onFocus={() => setFocusedField(field.id)}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <div className={`input-underline ${focusedField === field.id ? "active" : ""}`} />
                </div>
              </div>
            ))}

            {/* Password Field */}
            <div className={`form-group ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "300ms" }}>
              <label className={focusedField === "password" ? "focused" : ""}>Password</label>
              <div className="input-wrapper">
                <div className={`input-glow ${focusedField === "password" ? "active" : ""}`} />
                {renderIcon("lock", `input-icon ${focusedField === "password" ? "focused" : ""}`)}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={`form-group ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "350ms" }}>
              <label className={focusedField === "confirmPassword" ? "focused" : ""}>Confirm Password</label>
              <div className="input-wrapper">
                <div className={`input-glow ${focusedField === "confirmPassword" ? "active" : ""}`} />
                {renderIcon("lock", `input-icon ${focusedField === "confirmPassword" ? "focused" : ""}`)}
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <div className={`button-wrapper ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "400ms" }}>
              <button type="submit" className="signup-button-main" disabled={isLoading}>
                <div className="button-shine" />
                {isLoading ? (
                  <span className="loading"><div className="spinner" />Creating Account...</span>
                ) : (
                  <span className="button-content">
                    Create Account
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className={`divider ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "450ms" }}>
            <span>Already have an account?</span>
          </div>

          {/* Login Link */}
          <div className={`login-link-section ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "500ms" }}>
            <a href="/" className="login-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign In Instead
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Welcome Section */}
      <div className={`signup-right ${mounted ? "mounted" : ""}`}>
        <div className="welcome-content">
          {/* Floating circles */}
          <div className="floating-circles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="floating-circle" style={{ width: `${40 + i * 20}px`, height: `${40 + i * 20}px`, left: `${10 + (i * 12) % 80}%`, top: `${5 + (i * 15) % 85}%`, animationDelay: `${i * 0.7}s` }} />
            ))}
          </div>

          <h1 className={`welcome-title ${mounted ? "mounted" : ""}`}>
            <span>Join Our</span><br /><span className="highlight">Dealer Network</span>
          </h1>
          <p className={`welcome-subtitle ${mounted ? "mounted" : ""}`}>
            Unlock premium features and join a community of successful dealers driving growth together.
          </p>

          {/* Benefits */}
          <div className="benefits-list">
            {benefits.map((benefit, index) => (
              <div key={index} className={`benefit-card ${mounted ? "mounted" : ""}`} style={{ transitionDelay: `${300 + index * 100}ms` }}>
                <div className="benefit-icon">{renderIcon(benefit.icon)}</div>
                <div className="benefit-text">
                  <h3>{benefit.title} {renderIcon("check", "check-icon")}</h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className={`stats-grid ${mounted ? "mounted" : ""}`}>
            <div className="stat-card">
              <span className="stat-value">2,500+</span>
              <span className="stat-label">Active Dealers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">$50M+</span>
              <span className="stat-label">Monthly Volume</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>

          <p className={`welcome-footer ${mounted ? "mounted" : ""}`}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;