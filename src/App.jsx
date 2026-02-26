import React, { useState } from "react";
import Nav from "./components/Nav";
import UploadPage from "./pages/UploadPage";
import OptionsPage from "./pages/OptionsPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";

import "./App.css";

function App() {
  const [step, setStep] = useState("upload");
  const [fileData, setFileData] = useState(null);
  const [orderData, setOrderData] = useState(null);

  const reset = () => {
    setStep("upload");
    setFileData(null);
    setOrderData(null);
  };

  return (
    <>
      <Nav />

      {step === "upload" && (
        <UploadPage
          onContinue={(data) => {
            setFileData(data);
            setStep("options");
          }}
        />
      )}

      {step === "options" && (
        <OptionsPage
          fileData={fileData}
          onProceed={(order) => {
            setOrderData(order);
            setStep("payment");
          }}
        />
      )}

      {step === "payment" && (
        <PaymentPage onSuccess={() => setStep("success")} />
      )}

      {step === "success" && (
        <SuccessPage orderData={orderData} onReset={reset} />
      )}
    </>
  );
}

export default App;
