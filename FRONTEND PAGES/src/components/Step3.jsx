import { useState } from "react";
const Step3 = ({ nextStep }) => {
  const [accountNumber, setAcc] = useState("");
  const [ifscCode, setIfsc] = useState("");

  return (
    <div>
      <h2>Bank Details</h2>

      <input
        placeholder="Account Number"
        onChange={(e) => setAcc(e.target.value)}
      />

      <input
        placeholder="IFSC Code"
        onChange={(e) => setIfsc(e.target.value)}
      />

      <button onClick={() => nextStep({
        step: 3,
        accountNumber,
        ifscCode
      })}>
        Next
      </button>
    </div>
  );
};
export default Step3; 