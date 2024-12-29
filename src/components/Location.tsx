"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { useState } from "react";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";

// Define a type for counties and towns
type CountiesData = {
  [county: string]: string[]; // Each county (string) has an array of towns (strings)
};

// Import the counties data from the JSON file and assert the type
import countiesData from "../app/data/counties.json";

// Explicitly type countiesData as CountiesData
const typedCountiesData = countiesData as CountiesData;

export default function LocationSelector() {
  // Use `useSelector` to get the `currentStep` from the Redux store
  const currentStep = useSelector((state: any) => state.step.currentStep);

  // Use `useDispatch` to dispatch actions
  const dispatch = useDispatch();

  const handleNext = () => {
    // Dispatch the action to increment the step in the store
    dispatch(incrementStep());
  };

  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedTown, setSelectedTown] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const county = e.target.value;
    setSelectedCounty(county);
    setSelectedTown(""); // Reset the town when county is changed
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if both county and town are selected
    if (!selectedCounty || !selectedTown) {
      setError("Please select both County and Town.");
      return;
    }

    setError(""); // Clear any existing error
    console.log(`Selected County: ${selectedCounty}, Selected Town: ${selectedTown}`);
    dispatch(incrementStep());
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <label className="font-medium text-gray-700">Select Your Location:</label>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-medium text-gray-700">County:</label>
            <select
              value={selectedCounty}
              onChange={handleCountyChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-950 focus:outline-none text-gray-900"
            >
              <option value="">Select County</option>
              {Object.keys(typedCountiesData).map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          {selectedCounty && (
            <div>
              <label className="font-medium text-gray-700">Town:</label>
              <select
                value={selectedTown}
                onChange={(e) => setSelectedTown(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-950 focus:outline-none text-gray-900"
              >
                <option value="">Select Town</option>
                {typedCountiesData[selectedCounty].map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-purple-950 transition"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
