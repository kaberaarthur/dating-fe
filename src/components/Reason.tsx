"use client";
import { useState } from "react";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { useSelector, useDispatch } from "react-redux";

const Reason: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const dispatch = useDispatch();

  const [reason, setReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure a reason is selected
    if (!reason) {
      setError("Please select an option before proceeding.");
      return;
    }

    setError(""); // Clear error if validation passes
    console.log("Reason selected:", reason);
    dispatch(incrementStep()); // Proceed to the next step
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="font-sans flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label className="font-medium text-gray-700">What are you looking for:</label>
        <div className="flex flex-col gap-3">
          {["New friends", "Short-term dating", "Long-term dating", "Hookups"].map(
            (option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <input
                  type="radio"
                  name="reason"
                  value={option}
                  checked={reason === option}
                  onChange={(e) => setReason(e.target.value)}
                  className="text-purple-900 focus:ring-purple-900 focus:ring-2"
                />
                {option}
              </label>
            )
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Reason;
