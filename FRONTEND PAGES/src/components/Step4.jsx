import { useState } from "react";
const Step4 = ({ nextStep }) => {
  const [storeName, setStore] = useState("");
  const [fullName, setFullName] = useState("");

  return (
    <div>
      <h2>Supplier Details</h2>

      <input
        placeholder="Store Name"
        onChange={(e) => setStore(e.target.value)}
      />

      <input
        placeholder="Full Name"
        onChange={(e) => setFullName(e.target.value)}
      />

      <button onClick={() => nextStep({
        step: 4,
        storeName,
        fullName
      })}>
        Finish
      </button>
    </div>
  );
};
export default Step4;
