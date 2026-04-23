function Dashboard() {

  const dealer = JSON.parse(localStorage.getItem("dealer"));

  if (!dealer) {
    window.location.href = "/login";
  }

  return (
    <div>
      <h2>Welcome {dealer?.name}</h2>

      <button onClick={() => window.location.href="/products"}>
        Go to Products
      </button>
    </div>
  );
}

export default Dashboard;