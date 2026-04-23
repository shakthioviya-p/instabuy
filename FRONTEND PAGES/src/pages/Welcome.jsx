import { useNavigate } from "react-router-dom";
import sellerImg from "../assests/seller.png";
import "./Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="bg-glow"></div>
<div className="bg-circle"></div>

      {/* TOP BANNER */}
      <div className="top-banner">
        Start selling on Instabuy & unlock incentives up to ₹41,000*
      </div>

      {/* NAVBAR */}
      <div className="navbar">
       <div>
  <h2 className="logo">INSTABUY</h2>
  <p className="logo-tag">Smart Selling Starts Here</p>
</div>

        <div className="nav-right">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>

          <button className="sell-btn" onClick={() => navigate("/signup")}>
            Start Selling
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="hero">

        {/* LEFT */}
        <div className="hero-left">
          <h1>
            <span>Join Our</span> <br />
            Dealer Network
          </h1>

          <p>
            Unlock premium features and grow your business with Instabuy.
          </p>

          <button
            className="main-btn"
            onClick={() => navigate("/signup")}
          >
            Start Selling
          </button>
        </div>

        {/* RIGHT */}
<div className="hero-right">
  <img src={sellerImg} alt="seller" />
</div>
        

      </div>
            {/* STATS SECTION */}
{/* 🔥 STATS (HORIZONTAL) */}
<div className="stats-horizontal">

  <div>
    <h2>10K+</h2>
    <p>Active Sellers</p>
  </div>

  <div>
    <h2>50K+</h2>
    <p>Products Listed</p>
  </div>

  <div>
    <h2>₹1Cr+</h2>
    <p>Monthly Sales</p>
  </div>

</div>


{/* 🔥 CTA BELOW */}
<div className="cta-center">
  <h2>Start your journey with Instabuy today</h2>
  <p>Grow faster. Sell smarter. Earn more.</p>

  <button onClick={() => navigate("/signup")}>
    Become a Seller
  </button>
</div>

      {/* FEATURES SECTION */}
      <div className="features">

        <div className="feature-card">
  <div className="icon">⚡</div>
          <div>
    <h3>Instant Access</h3>
    <p>Get immediate access to inventory</p>
  </div>
</div>

        <div className="feature-card">
          <div className="icon">🔒</div>
          <div>
             <h3>Secure Platform</h3>
          <p>Your data is protected with security</p>

          </div>
         
        </div>

        <div className="feature-card">
          <div className="icon">🎧</div>
          <div>
          <h3>24/7 Support</h3>
          <p>Always available for dealers</p>
        </div>
        </div>

        <div className="feature-card">
          <div className="icon">📈</div>
          <div>
          <h3>Growth Tools</h3>
          <p>Analytics to grow your business</p>
        </div>
        </div>
  
</div>

      

    </div>
  );
}

export default Welcome;