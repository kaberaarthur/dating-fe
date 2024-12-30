"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { useState } from "react";
import { setUserDetails } from "../app/Redux/Reducers/userSlice"; // Import your setUserDetails action
import { incrementStep } from "../app/Redux/Reducers/stepSlice";

export default function AddBio() {
  const user = useSelector((state: RootState) => state.user);
  const currentStep = useSelector((state: any) => state.step.currentStep);

  // Use `useDispatch` to dispatch actions
  const dispatch = useDispatch();

  const [bio, setBio] = useState(user.bio);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if bio is empty
    if (!bio.trim()) {
      setError("Bio is required.");
      return;
    }

    setError(""); // Clear any existing error
    // alert(`Bio submitted: ${bio}`);
    dispatch(incrementStep());
    dispatch(setUserDetails({ bio: bio }));
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <label className="font-medium text-gray-700">Add your Bio:</label>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-950 focus:outline-none text-gray-900 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            rows={5}
            placeholder="Write your bio here..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-purple-900 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-950 transition"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
