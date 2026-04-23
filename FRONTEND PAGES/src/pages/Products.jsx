
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function Products() {

  const [products, setProducts] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);

  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    description: "",
    quantity: ""
  });

  const dealer = JSON.parse(localStorage.getItem("dealer"));

  if (!dealer) {
    window.location.href = "/login";
  }

 const loadProducts = useCallback(() => {
  axios.get(`http://localhost:8087/product/dealer/${dealer.dealerId}`)
    .then(res => setProducts(res.data));
}, [dealer.dealerId]);

 useEffect(() => {
  loadProducts();
}, [loadProducts]);

  const addProduct = async () => {
    await axios.post("http://localhost:8087/product/add", {
      ...newProduct,
      dealerId: dealer.dealerId
    });

    alert("Product Added");
    loadProducts();
  };
  const checkLowStock = async () => {
  const res = await axios.get(
    `http://localhost:8087/product/lowstock/${dealer.dealerId}`
  );

  setLowStockList(res.data);

  alert("Low stock products: " + res.data.length);
};

  return (
    <div>
      <h2>Products</h2>
      <button onClick={checkLowStock}>
  Check Low Stock
</button>

      <input placeholder="Name"
        onChange={(e)=>setNewProduct({...newProduct, productName:e.target.value})} />

      <br/>

      <input placeholder="Price"
        onChange={(e)=>setNewProduct({...newProduct, price:e.target.value})} />

      <br/>

      <input placeholder="Description"
        onChange={(e)=>setNewProduct({...newProduct, description:e.target.value})} />

      <br/>

      <input placeholder="Quantity"
        onChange={(e)=>setNewProduct({...newProduct, quantity:e.target.value})} />

      <br/>

      <button onClick={addProduct}>Add Product</button>

      <h3>My Products</h3>

      {products.map(p => {

  const isLow = p.quantity < 6;

  return (
    <div key={p.productId}
      style={{
        border: "1px solid black",
        margin: "10px",
        padding: "10px",
        background: isLow ? "#ffdddd" : "white"
      }}>

      <h4>{p.productName}</h4>
      <p>Price: ₹{p.price}</p>
      <p>Quantity: {p.quantity}</p>

      {isLow && (
        <p style={{ color: "red" }}>
          ⚠ Low Stock
        </p>
      )}

    </div>
  );
})}
 
    </div>
  );
}

export default Products;