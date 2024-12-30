"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { setUserDetails } from "../app/Redux/Reducers/userSlice";

const Form: React.FC = () => {
  // Use `useSelector` to get the `currentStep` and `user` (name) from the Redux store
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const user = useSelector((state: RootState) => state.user); // Get user data from Redux

  const dispatch = useDispatch();

  const handleNext = () => {
    dispatch(incrementStep());
  };

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Set initial first and last name values from the Redux store if they exist
  useEffect(() => {
    if (user.name) {
      const [storedFirstName, storedLastName] = user.name.split(" ");
      setFirstName(storedFirstName || ""); // Set first name from Redux or default to empty string
      setLastName(storedLastName || "");   // Set last name from Redux or default to empty string
    }
  }, [user.name]); // Run this effect when `user.name` changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setError("Both first name and last name are required");
    } else {
      setError("");
      const fullName = `${firstName} ${lastName}`; // Combine first name and last name
      console.log("Full Name submitted:", fullName);
      dispatch(incrementStep());
      dispatch(setUserDetails({ name: fullName })); // Dispatch the full name to Redux store
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <label htmlFor="firstName" className="font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
          className={`border p-2 rounded text-gray-900 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        <label htmlFor="lastName" className="font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Doe"
          className={`border p-2 rounded text-gray-900 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-800"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Form;
