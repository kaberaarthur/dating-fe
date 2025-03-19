import React, { useState, useEffect } from 'react';
import config from "../../data/config.json";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/Redux/Store"; 

const Superlikes = () => {
  const [superlikes, setSuperlikes] = useState(5);
  const [superlikesCount, setSuperlikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
      setPhoneNumber(data.phone);
  
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  const fetchSuperlikesCount = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
  
    try {
      const response = await fetch(`${config.baseUrl}/api/superlikes/count`, {
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
      setSuperlikesCount(data.amount);
  
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    console.log("Fetch Superlikes Count")
    fetchSuperlikesCount();
  }, []);

  const handleSuperlikesChange = (change: any) => {
    setSuperlikes((prev) => {
      const newSuperlikes = prev + change;
      return newSuperlikes >= 5 ? newSuperlikes : 5;
    });
  };

  const handleBuySuperlikes = async () => {
    setLoading(true);
    setSuccessMessage('');

    try {
        const response = await fetch(`${config.baseUrl}/api/superlikes/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ 
              amount: superlikes,
              phone: phoneNumber 
            })
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error("Invalid JSON response from server.");
        }

        if (!response.ok) {
            throw new Error(data?.error || "Something went wrong");
        }

        setSuccessMessage(`Successfully purchased ${superlikes} Superlikes.`);
        fetchSuperlikesCount();
    } catch (error: any) {
        console.error("Error purchasing Superlikes:", error);
        setSuccessMessage(`Error: ${error.message}`);
    } finally {
        setLoading(false);
        setSuperlikes(5);
    }
};

const [withdrawAmount, setWithdrawAmount] = useState(0);
const [withdrawLoading, setWithdrawLoading] = useState(false);
const [withdrawMessage, setWithdrawMessage] = useState("");
const [withdrawSuccess, setWithdrawSuccess] = useState(false);
const [notification, setNotification] = useState("");

const handleWithdrawSuperlikes = async () => {
  if (withdrawAmount <= 0) {
    setWithdrawMessage("Enter a valid amount");
    setWithdrawSuccess(false);
    return;
  }

  setWithdrawLoading(true);
  setWithdrawMessage("");

  try {
    const response = await fetch(`${config.baseUrl}/api/superlikes/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ amount: withdrawAmount }),
    });

    const data = await response.json();

    if (response.ok) {
      setWithdrawMessage(`Successfully withdrawn ${withdrawAmount} Superlikes`);
      setWithdrawSuccess(true);
    } else {
      setWithdrawMessage(data.error || "Withdrawal failed");
      setWithdrawSuccess(false);
    }
  } catch (error) {
    setWithdrawMessage("Server error, try again later");
    setWithdrawSuccess(false);
  } finally {
    setWithdrawLoading(false);
  }
};

  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-start w-full max-w-4xl mx-auto">
      {/* Buy Superlikes Card */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            You Currently Have <span className="text-purple-600">{superlikesCount}</span> Superlikes
          </h1>
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
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter phone number"
          />
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
              `Buy ${superlikes} Superlikes at ${superlikes * 30} KES`
            )}
          </button>
        </div>

        {successMessage && (
          <div className="text-center text-green-600 font-semibold mt-4">
            {successMessage}
          </div>
        )}
      </div>

      {/* Withdraw Superlikes Card */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Withdraw Superlikes</h1>
          <p className='text-purple-900 text-sm'>Every superlike is worth Kshs. 22. We process Payments on Every Teusday.</p>
        </div>
        <div className="mb-6">
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter amount to withdraw"
          />
        </div>

        <div className="mb-6">
        <button
          onClick={() => { 
            handleWithdrawSuperlikes(); 
            console.log("Handle Withdraw Superlikes");
          }}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:bg-red-300 flex justify-center items-center"
          disabled={withdrawAmount < 1 || withdrawLoading}
        >
          {withdrawLoading ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></div>
          ) : (
            `Withdraw ${withdrawAmount} (${withdrawAmount * 22}) Superlikes`
          )}
        </button>
        </div>

        {withdrawMessage && (
          <div className={`text-center font-semibold mt-4 ${withdrawSuccess ? "text-green-600" : "text-red-600"}`}>
            {withdrawMessage}
          </div>
        )}

        {notification && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded-lg text-center">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default Superlikes;