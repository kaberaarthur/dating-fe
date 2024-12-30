"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store"; // Assuming the store is set up correctly
import { setUserDetails } from "../app/Redux/Reducers/userSlice"; // Action to set user details (including interests)

const Interests: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Get the selected interests from the Redux store (default: an empty array if none are stored)
  const storedInterests = useSelector((state: RootState) => state.user.interests || []);

  const [selectedInterests, setSelectedInterests] = useState<string[]>(storedInterests);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState<boolean>(false);

  const interestsList = [
    "Music",
    "Sports",
    "Travel",
    "Art",
    "Technology",
    "Cooking",
    "Gaming",
    "Fitness",
    "Anime",
    "Art and Design",
    "Beauty",
    "Entertainment",
    "Fashion",
    "Finance and Business",
    "Food",
    "Comedy",
    "Health and Lifestyle",
    "Outdoors",
    "Reading and Literature",
    "Travel and Nature",
  ];

  // Handle selecting and deselecting interests
  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest) // Remove interest
        : [...prev, interest] // Add interest
    );
    setError(null); // Reset error when user selects/deselects an interest
  };

  // Handle when user moves to the next step
  const handleNext = () => {
    if (selectedInterests.length < 3) {
      setError("You must select at least 3 interests.");
    } else {
      console.log("Selected Interests:", selectedInterests);
      // Dispatch the selected interests to the store
      dispatch(setUserDetails({ interests: selectedInterests })); // Dispatch to Redux
      // Proceed to the next step or action

      setComplete(true);
    }
  };

  // UseEffect to update the local state when Redux store changes (in case of page reload or store reset)
  useEffect(() => {
    setSelectedInterests(storedInterests);
  }, [storedInterests]);

  useEffect(() => {
    console.log("Completed User: ", user);
  }, [complete]);

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg m-8"
      style={{ backgroundColor: "#2E0549", fontFamily: "Panchang, sans-serif", fontWeight: 100 }}
    >
      <div className="p-6 rounded-lg w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-white text-center mb-4">What are your interests?</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {interestsList.map((interest) => (
            <button
              key={interest}
              onClick={() => handleToggleInterest(interest)}
              className={`px-2 py-2 font-medium rounded-md border border-solid text-lg transition ${
                selectedInterests.includes(interest)
                  ? "bg-[#830AD1] text-white"
                  : "bg-white text-[#830AD1]"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        {error && <p className="text-yellow-400 text-center">{error}</p>}
        <button
          onClick={handleNext}
          className="bg-[#830AD1] text-white font-bold py-2 px-4 rounded-md hover:bg-[#4C0678] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Interests;
