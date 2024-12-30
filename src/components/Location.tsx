"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { useState, useEffect } from "react";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { setUserDetails } from "../app/Redux/Reducers/userSlice"; // Assuming you have a user slice with setUserDetails action

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

  // Get the default county and town from the Redux store
  const user = useSelector((state: RootState) => state.user); // Assuming the user object contains `county` and `town`

  const dispatch = useDispatch();

  const handleNext = () => {
    // Dispatch the action to increment the step in the store
    dispatch(incrementStep());
  };

  // Set initial county and town values from Redux store (if they exist)
  const [selectedCounty, setSelectedCounty] = useState<string>(user.county || ""); // Default to store value
  const [selectedTown, setSelectedTown] = useState<string>(user.town || ""); // Default to store value
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // If the Redux store has a county or town, update the state
    if (user.county) setSelectedCounty(user.county);
    if (user.town) setSelectedTown(user.town);
  }, [user.county, user.town]);

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

    // Dispatch the selected county and town to the Redux store
    dispatch(setUserDetails({ county: selectedCounty, town: selectedTown }));

    dispatch(incrementStep()); // Proceed to the next step
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
                {typedCountiesData[selectedCounty] && typedCountiesData[selectedCounty].length > 0 ? (
                  typedCountiesData[selectedCounty].map((town) => (
                    <option key={town} value={town}>
                      {town}
                    </option>
                  ))
                ) : (
                  <option disabled>No towns available</option>
                )}
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
