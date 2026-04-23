
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";

const API = "http://localhost:8087";
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export default function ProductsPage() {
 const dealerId = localStorage.getItem("dealerId");
const navigate = useNavigate();
const location = useLocation();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);


 

const loadProducts = useCallback(async () => {
  console.log("DealerId:", dealerId);

  // ✅ ADD THIS CHECK
  if (!dealerId) {
    console.error("DealerId missing");
    return;
  }

  const res = await axios.get(`${API}/product/dealer/${dealerId}`, getAuthHeaders());
  setProducts(res.data);
}, [dealerId]);
useEffect(() => {
  loadProducts();
}, [loadProducts]);

 const handleSearch = async (value) => {
    setSearch(value);
    if (!value.trim()) {
        loadProducts();
        return;
    }
    try {
        const res = await axios.get(
            `${API}/product/search?keyword=${value}&dealerId=${dealerId}`, 
            getAuthHeaders()
        );
        setProducts(res.data);
    } catch (err) {
        console.error("Search error:", err);
    }
};
 const addStock = async (p) => {
    const qty = prompt("Add quantity");
    if (!qty) return;

    await axios.post(`${API}/product/addStock`, {
      productName: p.productName,
      dealerId,
      quantity: Number(qty),
    }, getAuthHeaders());

    loadProducts();
  };

const reduceStock = async (p) => {
    const qty = prompt("Reduce quantity");
    if (!qty) return;

    await axios.post(`${API}/product/reduce`, {
      productName: p.productName,
      dealerId,
      quantity: Number(qty),
    }, getAuthHeaders());

    loadProducts();
  };

 const deleteProduct = async (p) => {
  const token = localStorage.getItem("token");

  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await axios.delete(
      `${API}/product/delete/${p.productId}`,   // ✅ use productId
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Product deleted successfully");

    loadProducts();   // 🔄 refresh list

  } catch (err) {
    console.error("Delete error:", err);

    if (err.response) {
      alert(err.response.data || "Delete failed");
    } else {
      alert("Server error");
    }
  }
};

   // ✅ EDIT CHANGE
 const handleEditClick = (product) => {
  setEditProduct({
    productId: product.productId,
    productName: product.productName,
    price: product.price,
    description: product.description || ""
  });
   
};
const handleEditChange = (e) => {
  setEditProduct({
    ...editProduct,
    [e.target.name]: e.target.value
  });
};


  // ✅ SAVE EDIT
  const saveEdit = async () => {
    if (!editProduct.productName || !editProduct.price) {
      alert("Fill all fields");
      return;
    }

    try {
     await axios.put(`${API}/product/update`, editProduct, getAuthHeaders());
      alert("Updated successfully");
      setEditProduct(null);
      loadProducts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page">

    <div className="topbar">
  <p className="topbar-text">
    Manage your inventory — grow your business 🚀
  </p>
</div>
      {/* NAVBAR */}
      <div className="navbar">

  <div className="logo">DealerHub</div>

  <div className="nav-links">
    <div className="nav-links">

  <span
    className={location.pathname === "/dashboard" ? "active" : ""}
    onClick={() => navigate("/dashboard")}
  >
    Dashboard
  </span>

  <span
    className={location.pathname === "/products" ? "active" : ""}
    onClick={() => navigate("/products")}
  >
    Products
  </span>

  <span
    className={location.pathname === "/lowstock" ? "active" : ""}
    onClick={() => navigate("/lowstock")}
  >
    Low Stock
  </span>

  <span>Reports</span>

</div>
  </div>

  <div className="nav-right">
  <span>Welcome, {localStorage.getItem("dealerName") || "Dealer"}</span>
    <span>🔔</span>
    <span style={{ cursor: "pointer" }} onClick={() => {
      localStorage.clear();
      window.location.href = "/";
    }}>
    
    </span>
  </div>

</div>

      {/* SEARCH */}
     <div className="search-wrap">
  <div className="search-box">

    <span className="search-icon">🔍</span>

    <input
      value={search}
      placeholder="Search products by name or ID"
      onChange={(e) => handleSearch(e.target.value)}
    />

  </div>
</div>

      {/* PRODUCTS */}
     <div className="grid">
  {products.map((p) => (
    <div className="card" key={p.productId}>
        {/* ✅ EDIT ICON */}
           <div className="edit-icon" onClick={() => {
  alert("clicked");
  handleEditClick(p);
}}>
  ✏️
</div>


  <div className="card-content">

    <img
      src={
        p.imageUrl
          ? `http://localhost:8087/uploads/${p.imageUrl}`
          : "https://via.placeholder.com/300"
      }
      alt=""
    />

    <h4>{p.productName}</h4>

    <div className="price">₹{p.price}</div>

    <div className="qty">{p.quantity} units</div>

  </div>

  {/* ACTIONS SEPARATE */}
  <div className="actions">
    <button onClick={() => addStock(p)}>＋</button>
    <button onClick={() => reduceStock(p)}>－</button>
    <button onClick={() => deleteProduct(p)}>🗑</button>
  </div>

</div>
  ))}
</div>
{/* ✅ EDIT MODAL */}
     {/* ✅ MODAL */}
      {editProduct && (
       <div
  className="modal"
  onClick={(e) => {
    if (e.target.className === "modal") {
      setEditProduct(null);
    }
  }}
>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <h3>Edit Product</h3>

            <input
              name="productName"
              value={editProduct.productName}
              onChange={handleEditChange}
              placeholder="Product Name"
            />

            <input
              type="number"
              name="price"
              value={editProduct.price}
              onChange={handleEditChange}
              placeholder="Price"
            />

            <textarea
              name="description"
              value={editProduct.description}
              onChange={handleEditChange}
              placeholder="Description"
            />

            <div className="modal-actions">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

      <div className="footer">

  <div className="footer-col">
    <h4>SERVICES</h4>
    <p>customer service</p>
    <p>payment</p>
    <p>shipping</p>
    <p>returns</p>
  </div>

  <div className="footer-col">
    <h4>MONK & ANNA</h4>
    <p>about</p>
    <p>wholesale</p>
    <p>contact</p>
    <p>terms & conditions</p>
    <p>promotion conditions</p>
  </div>

  <div className="footer-col newsletter">
    <h4>NEWSLETTER</h4>

    <div className="newsletter-box">
      <input placeholder="Email" />
      <span>→</span>
    </div>
  </div>

</div>



      </div>
    
    
  );
}