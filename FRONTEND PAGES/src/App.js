import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Onboarding from "./pages/Onboarding";
import MainDashboard from "./pages/MainDashboard";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DealerProfile from "./pages/DealerProfile";




import ProductsPage from "./pages/ProductsPage";
import LowStockPage from "./pages/LowStockPage";
import UserProducts from "./pages/UserProducts";

import ProductDetail from "./pages/ProductDetail";
import CartPage      from "./pages/CartPage";
import Navbar        from "./components/Navbar";
import { CartProvider } from "./context/CartContext";


function App() {
  return (
    <CartProvider> 

   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/products" element={<ProductsPage />} />
<Route path="/lowstock" element={<LowStockPage />} />
<Route path="/user-products" element={<UserProducts />} />
<Route path="/homepage" element={<HomePage />} />
<Route path="/shop"        element={<><Navbar /><UserProducts /></>} />
<Route path="/product/:id" element={<><Navbar /><ProductDetail /></>} />
<Route path="/cart"        element={<><Navbar /><CartPage /></>} />
<Route path="/profile" element={<DealerProfile />} />


<Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
     </CartProvider>
  );
}

export default App;