"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";

const Form: React.FC = () => {
  const currentStep = useSelector((state: any) => state.step.currentStep);
  const dispatch = useDispatch();

  const handleNext = () => {
    dispatch(incrementStep());
  };

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
    } else {
      setError("");
      console.log("Email submitted:", email);
      dispatch(incrementStep());
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label htmlFor="email" className="font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className={`border p-2 rounded text-gray-900 ${
            error ? "border-red-500" : "border-purple-300"
          }`}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="promotions" className="w-4 h-4" />
          <label htmlFor="promotions" className="text-gray-600">
            I don‘t want to miss discounts & promotional emails from OkCupid
          </label>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950"
        >
          Next
        </button>
      </form>
    </div>
  );
  
};

export default Form;
