"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";

const PhoneNumber: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const dispatch = useDispatch();

  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isValidPhoneNumber = (number: string): boolean => {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phone)) {
      setError("Please enter a valid phone number (e.g., 123-456-7890).");
      return;
    }

    setError("");
    console.log("Phone number entered:", phone);
    dispatch(incrementStep());
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label className="font-medium text-gray-700">Enter your phone number:</label>
        <input
          type="text"
          placeholder="0712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-gray-300 rounded p-2 text-gray-900 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PhoneNumber;
