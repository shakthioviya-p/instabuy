import { useState } from "react";
const Step1 = ({ nextStep }) => {
  const [gstNumber, setGst] = useState("");
  const [eid, setEid] = useState("");

  return (
    <div>
      <h2>Business Details</h2>

      <input
        placeholder="GST Number"
        onChange={(e) => setGst(e.target.value)}
      />

      <input
        placeholder="EID"
        onChange={(e) => setEid(e.target.value)}
      />

      <button
  type="button"
  onClick={() => {
    console.log("Clicked");
    nextStep({ step: 1, gstNumber, eid });
  }}
>
  Next
</button>
    </div>
  );
};
export default Step1; 