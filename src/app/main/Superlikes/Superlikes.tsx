import React, { useState, useEffect } from 'react';
import config from "../../data/config.json";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/Redux/Store"; 

const Superlikes = () => {
  const [superlikes, setSuperlikes] = useState(5); // Default number of Superlikes is 5
  const [loading, setLoading] = useState(false); // Loading state for button
  const [successMessage, setSuccessMessage] = useState(''); // Success alert message
  const [phoneNumber, setPhoneNumber] = useState(''); // Success alert message

  const accessToken = localStorage.getItem("accessToken");
  const user = useSelector((state: RootState) => state.user);

  const fetchUser = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
  
    try {
      const response = await fetch(`${config.baseUrl}/api/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
  
      const data = await response.json();
      console.log("User Account Data:", data); // Logs the user profile data
      setPhoneNumber(data.phone);
  
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  // Handle adding or subtracting superlikes
  const handleSuperlikesChange = (change: any) => {
    setSuperlikes((prev) => {
      const newSuperlikes = prev + change;
      return newSuperlikes >= 5 ? newSuperlikes : 5; // Minimum 5 Superlikes
    });
  };

  // Handle button click (purchase Superlikes)
  const handleBuySuperlikes = () => {
    setLoading(true); // Start loading
    setSuccessMessage(''); // Reset any previous success message

    setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
      setSuccessMessage(`Successfully purchased ${superlikes} Superlikes.`);
      setSuperlikes(5);
    }, 2000);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Superlikes</h1>
      </div>
      <div className="mb-6">
        <div className="flex justify-center items-center mb-4">
          <button
            className="bg-purple-600 text-white rounded-full px-4 py-2 hover:bg-purple-700"
            onClick={() => handleSuperlikesChange(-1)}
          >
            -
          </button>
          <input
            type="number"
            value={superlikes}
            readOnly
            className="mx-4 w-16 text-center bg-gray-100 border border-gray-300 rounded-md py-2"
          />
          <button
            className="bg-purple-600 text-white rounded-full px-4 py-2 hover:bg-purple-700"
            onClick={() => handleSuperlikesChange(1)}
          >
            +
          </button>
        </div>
        <p className="text-sm text-gray-500">Minimum Superlikes: 5</p>
      </div>

      <div className="mb-6">
        <p className="text-gray-700">Phone Number: {phoneNumber}</p>
      </div>

      <div className="mb-6">
        <button
          onClick={handleBuySuperlikes}
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:bg-purple-300 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></div>
          ) : (
            `Buy ${superlikes} Superlikes at ${superlikes * 50} KES`
          )}
        </button>
      </div>

      {successMessage && (
        <div className="text-center text-green-600 font-semibold mt-4">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Superlikes;
