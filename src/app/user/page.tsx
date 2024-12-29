"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { setUserDetails } from "../Redux/Reducers/userSlice";

const UserPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [name, setName] = useState("");

  // Define the user data you want to dispatch
  const handleDispatchUser = () => {
    const userData = {
      id: 1,
      name: name || "Default Name", // Use input or fallback to default
      email: "john@example.com",
      phone: "1234567890",
      user_type: "admin",
      company_id: 100,
      company_username: "@company",
      usertoken: "token123",
    };

    dispatch(setUserDetails(userData));
    console.log("User Dispatched:", userData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 font-sans">User Page</h1>

      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          onClick={handleDispatchUser}
        >
          Dispatch User Details
        </button>
      </div>

      <div className="text-gray-900 mt-8 w-full max-w-2xl bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current User State:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserPage;
