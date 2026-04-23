import { useState } from "react";
const Step2 = ({ nextStep }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  return (
    <div>
      <h2>Pickup Address</h2>

      <input placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="City" onChange={(e) => setCity(e.target.value)} />
      <input placeholder="State" onChange={(e) => setState(e.target.value)} />

      <button onClick={() => nextStep({
        step: 2,
        address,
        city,
        state
      })}>
        Next
      </button>
    </div>
  );
};
export default Step2;