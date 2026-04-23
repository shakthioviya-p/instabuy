import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

 const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

  try {
  const res = await axios.post("http://localhost:8087/api/dealer/login", {
    email,
    password,
  });

 const token = res.data.token;
localStorage.setItem("token", token);

// Decode JWT
const payload = JSON.parse(atob(token.split('.')[1]));

localStorage.setItem("dealerId", payload.dealerId);
localStorage.setItem("dealerEmail", payload.sub);

// ✅ ADD THIS LINE (VERY IMPORTANT)
localStorage.setItem("dealerName", payload.name || payload.sub);

navigate("/dashboard");
} catch {
  setError("Invalid login credentials. Please try again.");
} finally {
      setIsLoading(false);
    }
};

  const quotes = [
    { text: "Success in business is about building relationships that last a lifetime.", author: "Industry Leader" },
    { text: "The best partnerships are built on trust, transparency, and mutual growth.", author: "Business Mentor" },
    { text: "Every great achievement begins with the decision to try.", author: "Entrepreneur" },
    { text: "Your network is your net worth. Invest in relationships.", author: "Sales Expert" }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="login-container">
      {/* LEFT SIDE - Login Form */}
      <div className={`login-left ${mounted ? "mounted" : ""}`}>
        <div className="login-box">
          {/* Floating particles */}
          <div className="particles">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <div className={`logo-section ${mounted ? "mounted" : ""}`}>
            <div className="logo-wrapper">
              <div className="logo-icon">
                <span>D</span>
              </div>
              <div className="logo-text">
                <span className="brand-name">DealerHub</span>
                <span className="brand-tagline">
                  <svg className="sparkle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/>
                  </svg>
                  Premium Dealer Portal
                </span>
              </div>
            </div>
            <p className="login-subtitle">
              Sign in to access your exclusive dealer portal and unlock premium features.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className={`form-group ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "100ms" }}>
              <label className={focusedField === "email" ? "focused" : ""}>
                Email Address
              </label>
              <div className="input-wrapper">
                <div className={`input-glow ${focusedField === "email" ? "active" : ""}`} />
                <svg
                  className={`input-icon ${focusedField === "email" ? "focused" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <input
                  type="email"
                  placeholder="dealer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <div className={`input-underline ${focusedField === "email" ? "active" : ""}`} />
              </div>
            </div>

            {/* Password Field */}
            <div className={`form-group ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "200ms" }}>
              <label className={focusedField === "password" ? "focused" : ""}>
                Password
              </label>
              <div className="input-wrapper">
                <div className={`input-glow ${focusedField === "password" ? "active" : ""}`} />
                <svg
                  className={`input-icon ${focusedField === "password" ? "focused" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <circle cx="12" cy="16" r="1" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
                <div className={`input-underline ${focusedField === "password" ? "active" : ""}`} />
              </div>
            </div>

            {/* Forgot Password */}
            <div className={`forgot-password ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "300ms" }}>
              <a href="/forgot-password">
                Forgot password?
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Login Button */}
            <div className={`button-wrapper ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "400ms" }}>
              <button type="submit" className="login-button" disabled={isLoading}>
                <div className="button-shine" />
                {isLoading ? (
                  <span className="loading">
                    <div className="spinner" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="button-content">
                    Sign In to Portal
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className={`divider ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "500ms" }}>
            <span>New to DealerHub?</span>
          </div>

          {/* Signup Link */}
          <div className={`signup-section ${mounted ? "mounted" : ""}`} style={{ transitionDelay: "600ms" }}>
            <a href="/signup" className="signup-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Create New Account
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <p className="signup-note">
              Join 2,500+ dealers already growing their business with us
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Welcome Section */}
      <div className={`login-right ${mounted ? "mounted" : ""}`}>
        <div className="welcome-content">
          {/* Floating circles */}
          <div className="floating-circles">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="floating-circle"
                style={{
                  width: `${40 + i * 20}px`,
                  height: `${40 + i * 20}px`,
                  left: `${10 + (i * 12) % 80}%`,
                  top: `${5 + (i * 15) % 85}%`,
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}
          </div>

          {/* Stars */}
          <div className={`stars ${mounted ? "mounted" : ""}`}>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="star"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transitionDelay: `${800 + i * 100}ms` }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {/* Welcome Text */}
          <h1 className={`welcome-title ${mounted ? "mounted" : ""}`}>
            <span>Welcome Back,</span>
            <br />
            <span className="highlight">Partner</span>
          </h1>
          <p className={`welcome-subtitle ${mounted ? "mounted" : ""}`}>
            Access exclusive inventory, competitive pricing, and dedicated support designed for your success.
          </p>

          {/* Quote Section */}
          <div className={`quote-card ${mounted ? "mounted" : ""}`}>
            <svg className="quote-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
            <div className={`quote-text ${isAnimating ? "animating" : ""}`}>
              <p>"{quotes[currentQuote].text}"</p>
              <span className="quote-author">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                {quotes[currentQuote].author}
              </span>
            </div>
            <div className="quote-indicators">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentQuote ? "active" : ""}`}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentQuote(index);
                      setIsAnimating(false);
                    }, 400);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={`stats-grid ${mounted ? "mounted" : ""}`}>
            <div className="stat-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span className="stat-value">45%</span>
              <span className="stat-label">Average Growth</span>
            </div>
            <div className="stat-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              <span className="stat-value">2,500+</span>
              <span className="stat-label">Active Dealers</span>
            </div>
            <div className="stat-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              <span className="stat-value">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div>

          {/* Footer */}
          <p className={`welcome-footer ${mounted ? "mounted" : ""}`}>
            Trusted by dealers across the nation since 2015
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;