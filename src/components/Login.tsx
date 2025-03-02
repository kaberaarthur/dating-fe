"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { RootState } from "../app/Redux/Store";
import { setUserDetails } from "../app/Redux/Reducers/userSlice";

import config from "../app/data/config.json";

import Link from "next/link";
import { Loader2 } from "lucide-react";

const Login: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  

  // Check if logged in user exists
  if (accessToken) {
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
    setLoading(true);
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
        console.log("Starting Login");
        const response = await fetch(`${config.baseUrl}/api/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.log("Error logging in User:", errorData);
            setError("An Error Occurred");
            return;
          }
    
          const result = await response.json();
          console.log("User logged in successfully:", result);

          // Store Tokens
          localStorage.setItem("accessToken", result.accessToken);
          localStorage.setItem("refreshToken", result.refreshToken);

          console.log("Completed Login");


          getUserProfile(result.accessToken, result.user_id);

          // console.log(result.accessToken);
        } catch (error) {
            console.error("Unexpected error occured:", error);
        }
    }

    setLoading(false);
  };

  const getUserProfile = async (accessToken: string, user_id: number) => {
    console.log("Getting User Profile");
    try{
        const response = await fetch(`${config.baseUrl}/api/user-profiles/my-profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.log("Error fetching user profile:", errorData);
            return;
          }
          
          const result = await response.json();
          dispatch(setUserDetails(result)); // Dispatch to Redux
    }catch (error) {
        console.error("Unexpected error occured:", error);
        setError("Unexpected error occured");
    }
  }

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
                   {" Register"}
                </Link>
              </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
