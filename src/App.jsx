import { useState } from "react";
import "./App.css";
import Rooms from "./calculatorComponents/rooms.jsx";
import Products from "./products.jsx";
import Results from "./calculatorComponents/Results.jsx";
import { calculateTotal } from "./calculatorComponents/calculation";
import { ROOM_TYPES } from "./constants";

export default function TileQuiz() {
  const [step, setStep] = useState("addMaterials");
  const [results, setResults] = useState(null);

  const handleCalculate = (rooms) => {
    const { total, allRooms } = calculateTotal(rooms);
    setResults({ total, allRooms });
    setStep("results");
  };

  const handleReset = () => {
    setStep("selectFirstRoom");
    setResults(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-1 sm:p-4 font-sans">
      <div className="max-w-2xl w-full bg-white p-1 sm:p-6 md:p-8">
        {step !== "results" && (
          <Rooms step={step} setStep={setStep} onCalculate={handleCalculate} />
        )}

        {step === "results" && results && (
          <Results results={results} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
