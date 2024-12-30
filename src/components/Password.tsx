"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { setUserDetails } from "../app/Redux/Reducers/userSlice"; // Import your setUserDetails action

const Password: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const dispatch = useDispatch();

  const [password, setPassword] = useState<string>(user.password || "");
  const [error, setError] = useState<string>("");

  // Password validation (at least 8 characters, one uppercase, one number)
  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters long, contain at least one uppercase letter and one number.");
      return;
    }

    setError("");
    console.log("Password entered:", password);

    // Dispatch the password to Redux
    dispatch(setUserDetails({ password: password }));

    // Proceed to the next step
    dispatch(incrementStep());
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label className="font-medium text-gray-700">Enter your password:</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded p-2 text-gray-900 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Password;
