import { useState, useEffect } from "react";
import config from "../../data/config.json";

import { setActiveLink } from "../../../app/Redux/Reducers/activeLinkSlice";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/Redux/Store"; 

interface Plan {
  id: number;
  name: string;
  description: string;
  features: string; // Stored as a JSON string
  period: number;
  created_at: string;
  updated_at: string;
  price: string; 
  popular: boolean;
}

const Premium = () => {
  const [activeTab, setActiveTab] = useState("premium");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("0712345678"); // Default number
  const [isPaying, setIsPaying] = useState(false); // Payment processing state

  const [receiptData, setReceiptData] = useState<{ transactionId: string; amount: string; status: string } | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);


  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();
  // Function to handle link click and set active component
  const handleLinkClick = (link: string) => {
    dispatch(setActiveLink(link));
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(`${config.baseUrl}/api/plans`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }

        const data = await response.json();

        if (data && data.plans) {
          const formattedPlans = data.plans.map((plan: any) => ({
            ...plan,
            popular: Boolean(plan.popular), // Ensure boolean value
          }));

          setPlans(formattedPlans);
          setSelectedPlan(formattedPlans[3]);
        } else {
          throw new Error("No plans data available");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = () => {
    if (selectedPlan) {
      setIsModalOpen(true);
    }
  };

  async function handlePayWithMpesa (phone: string, plan_id: number, accessToken: string) {
    if (!phone || !plan_id || !accessToken) {
          console.log("Error: Missing required parameters.");
          alert("Please provide a valid phone number, plan, and access token.");
          return;
      }

    setIsPaying(true);
      try {
        const response = await fetch(`${config.baseUrl}/api/mpesa-requests`, {
            method: 'POST', // Set the request method to POST
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Authorization header with the access token
                'Content-Type': 'application/json', // Ensure the body is in JSON format
            },
            body: JSON.stringify({ phone, plan_id }) // Request body with phone and plan_id as JSON
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response body as JSON
        const data = await response.json();

        // Handle the response data
        console.log('Request sent successfully:', data);
        setIsPaying(false);

        // Simulate successful payment response
        setReceiptData({
          transactionId: data.data.mpesa_receipt_number || "TXN123456789",
          amount: `KES ${selectedPlan?.price}`,
          status: "Success",
        });

        setIsModalOpen(false);
        setIsReceiptModalOpen(true);
        return data; // You can process this further as needed

    } catch (error) {
       setIsPaying(false);
        if (error instanceof Error) {
          setError('Error sending Mpesa request, contact support on +254 713 579545');
            console.log('Error sending Mpesa request:', error.message);
        } else {
          setError('Error handling Mpesa Payment');
            console.log('Unknown error:', error);
        }
        return null;
    }
  };

  return (
    <div className="text-center py-4 lg:px-24">
      <div className="bg-black text-white py-4 px-4 text-lg font-medium">
        Amazing OkCupid features you can’t live without.
      </div>

      {/* Plans Section */}
      <div className="mt-6 w-full flex justify-center">
        <div className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl grid grid-cols-1 gap-12">
          {/* Plans Column */}
          <div>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border p-4 mb-4 cursor-pointer ${
                  selectedPlan?.id === plan.id
                    ? "border-purple-500 bg-purple-200"
                    : plan.popular
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.popular && (
                  <span className="bg-purple-500 text-white text-xs uppercase px-2 py-1 inline-block mb-2">
                    Most Popular
                  </span>
                )}
                <div className="flex justify-center items-center">
                  <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <p className="text-gray-700">{plan.description}</p>
                    <p className="text-gray-700 font-semibold">KES {plan.price}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Subscription Button */}
            <button 
              className={`w-full bg-blue-600 text-white py-3 font-bold rounded mt-4 ${!selectedPlan ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSubscribe}
              disabled={!selectedPlan}
            >
              {selectedPlan ? `Subscribe to ${selectedPlan.name}` : "Select a Plan"}
            </button>

            <p className="text-gray-500 text-sm mt-2 text-center">This is a secure page</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Payment for {selectedPlan.name}</h2>
            
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />

            <p className="text-red-500 text-md font-semibold">{error}</p>
            <button
              className="w-full bg-green-600 text-white py-3 font-bold rounded mt-4 flex justify-center items-center"
              onClick={() => handlePayWithMpesa(phoneNumber, selectedPlan?.id, accessToken ?? "")}
              disabled={isPaying}
            >
              {isPaying ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></div>
              ) : (
                "Pay with Mpesa"
              )}
            </button>

            <button 
              className="w-full border border-gray-300 text-gray-700 py-2 font-bold rounded mt-2"
              onClick={() => {
                  setIsModalOpen(false);
                  setError(""); // Set the error message
              }}
              disabled={isPaying}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {isReceiptModalOpen && receiptData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-4">Payment Successful</h2>
            <p>Transaction ID: {receiptData.transactionId}</p>
            <p>Amount: {receiptData.amount}</p>
            <p>Status: {receiptData.status}</p>
            <button
              className="w-full bg-blue-600 text-white py-3 font-bold rounded mt-4"
              onClick={() => {
                setIsReceiptModalOpen(false); // Close the receipt modal
                handleLinkClick("discover"); // Navigate or trigger the desired action
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
