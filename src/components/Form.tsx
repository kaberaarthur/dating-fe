"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";

import { RootState } from "../app/Redux/Store";
import { setUserDetails } from "../app/Redux/Reducers/userSlice";

import Link from "next/link";

const Form: React.FC = () => {
  const currentStep = useSelector((state: any) => state.step.currentStep);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>(user.email);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
    } else {
      setError("");
      console.log("Email submitted:", email);
      dispatch(incrementStep());
      dispatch(setUserDetails({ email })); // Dispatch only the email
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
            I don‘t want to miss discounts & promotional emails from SocialPendo
          </label>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="promotions" className="text-gray-600">
            Already signed up? 
              <span className="text-purple-800 underline">
                <Link href="/login">
                  Login
                </Link>
              </span>
          </label>
        </div>
        <button
          type="submit" // Make sure the button type is 'submit' to trigger the form's onSubmit
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Form;
