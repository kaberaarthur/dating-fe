"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { setUserDetails } from "../app/Redux/Reducers/userSlice"; // Assuming you have a user slice with setUserDetails action

const Reason: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const user = useSelector((state: RootState) => state.user); // Get user data from Redux (including reason)
  const dispatch = useDispatch();

  const [reason, setReason] = useState<string>("");

  const [error, setError] = useState<string>("");

  // Set initial reason value from Redux store (if it exists)
  useEffect(() => {
    if (user.reason) {
      setReason(user.reason); // Preselect the stored reason from Redux if available
    }
  }, [user.reason]); // Run effect when `user.reason` changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Ensure a reason is selected
    if (!reason) {
      setError("Please select an option before proceeding.");
      return;
    }

    setError(""); // Clear error if validation passes

    console.log("Reason selected:", reason);
    
    // Dispatch the selected reason to the Redux store
    dispatch(setUserDetails({ reason }));

    dispatch(incrementStep()); // Proceed to the next step
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="font-sans flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label className="font-medium text-gray-700">What are you looking for:</label>
        <div className="flex flex-col gap-3">
          {["New friends", "Short-term dating", "Long-term dating", "Hookups"].map(
            (option) => (
              <label
                key={option}
                className="flex items-center gap-2 text-gray-700 font-medium"
              >
                <input
                  type="radio"
                  name="reason"
                  value={option}
                  checked={reason === option} // Check if the current option matches the selected reason
                  onChange={(e) => setReason(e.target.value)} // Update reason state
                  className="text-purple-900 focus:ring-purple-900 focus:ring-2"
                />
                {option}
              </label>
            )
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Reason;
