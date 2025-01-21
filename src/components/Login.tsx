"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { RootState } from "../app/Redux/Store";
import { setUserDetails } from "../app/Redux/Reducers/userSlice";

import config from "../app/data/config.json";

import Link from "next/link";

const Login: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  // Check if logged in user exists
  if (user.id) {
    window.location.href = "/main"
  }

  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>(user.email || "");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const userData = {
    email: email,
    password: password
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError("Both email and password are required");
      return;
    } else {
      setError("");
      console.log("Email:", email, "Password:", password);

      // Sign the User In
      try {
        const response = await fetch(`${config.baseUrl}/api/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error creating user profile:", errorData);
            return;
          }
    
          const result = await response.json();
          console.log("User profile created successfully:", result);
        } catch (error) {
            console.error("Unexpected error occured:", error);
        }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        {/* Email Input */}
        <label htmlFor="email" className="font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className={`border p-2 rounded text-gray-900 ${error ? "border-red-500" : "border-purple-300"}`}
        />

        {/* Password Input */}
        <label htmlFor="password" className="font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={`border p-2 rounded text-gray-900 ${error ? "border-red-500" : "border-purple-300"}`}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Checkbox for promotions */}
        <div className="flex items-center gap-2">
          <label htmlFor="promotions" className="text-gray-600">
            Not yet signed up? 
              <span className="text-purple-800 underline">
                <Link href="/register">
                   Register
                </Link>
              </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
