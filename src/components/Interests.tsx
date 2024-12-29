// components/Interests.tsx
"use client";
import { useState } from "react";

const Interests: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
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
    "Travel and Nature"
  ];

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest) // Remove interest
        : [...prev, interest] // Add interest
    );
    setError(null); // Reset error when user selects/deselects an interest
  };

  const handleNext = () => {
    if (selectedInterests.length < 3) {
      setError("You must select at least 3 interests.");
    } else {
      console.log("Selected Interests:", selectedInterests);
      // Proceed to next step or action
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg m-8" style={{ backgroundColor: "#2E0549", fontFamily: 'Panchang, sans-serif', fontWeight: 100 }}>
      <div className="p-6 rounded-lg w-full max-w-md flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white text-center mb-4">What are your interests?</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {interestsList.map((interest) => (
            <button
              key={interest}
              onClick={() => handleToggleInterest(interest)}
              className={`px-4 py-2 font-medium rounded-md border border-solid text-lg transition ${
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
