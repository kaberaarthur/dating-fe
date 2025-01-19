import React, { useState, useEffect } from "react";
import model from "../../../../public/model.png";
import cupidarrow from "../../../../public/cupidarrow.png";
import config from "../../data/config.json";

// Hero Icons
import { XMarkIcon, HeartIcon } from "@heroicons/react/24/solid";

// Dummy Data
import dummyFemales from "../../../app/data/dummyFemales.json";

type ProfileHeaderProps = {
  name: string;
  location: string;
  age: number;
  matchPercentage: number;
  profileImage: string;
  nextProfile: (actionType: string) => void; // Type this prop correctly
};

type SectionProps = {
  title: string;
  content: string;
  buttonText: string;
};

type DetailsProps = {
  title: string;
  details: string[];
};

// Profile Header Component
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  location,
  age,
  matchPercentage,
  profileImage,
  nextProfile, // Accept nextProfile as a prop
}) => (
  <div className="flex flex-col items-center bg-white shadow-md border border-gray-200 rounded-md p-4 w-full max-w-4xl mx-auto">
    <div className="flex items-center w-full justify-between mb-4">
      {/* Name and Location */}
      <div>
        <h1 className="text-xl font-bold">{name}</h1>
        <p className="text-gray-900 text-sm">
          {age} • {location}
        </p>
      </div>
      {/* Match Percentage */}
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center justify-center text-[#8207D1] font-bold border-2 border-[#8207D1] rounded-full w-10 h-10 p-6">
          {matchPercentage}%
        </div>
      </div>
    </div>
    {/* Profile Image */}
    <div className="relative">
      <img
        src={`/${profileImage}`} // Ensure profileImage path is correct
        alt="Model Image"
        className="rounded-md w-64 h-64 object-cover"
      />
      <button className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs py-1 px-2 rounded-full hover:bg-blue-700">
        Intro
      </button>
    </div>
    {/* Interaction Buttons */}
    <div className="flex space-x-4 mt-4 text-xl">
      <button 
        onClick={() => nextProfile('Pass')}
        className="flex items-center space-x-2 border border-gray-700 text-gray-700 font-medium py-2 px-6 rounded-full hover:bg-gray-100">
        <XMarkIcon className="w-5 h-5" />
        <span>Pass</span>
      </button>
      <button 
        onClick={() => nextProfile('Like')}
        className="flex items-center space-x-2 bg-pink-500 text-white font-medium py-2 px-6 rounded-full hover:bg-pink-600"
      >
        <HeartIcon className="w-5 h-5" />
        <span>Like</span>
      </button>
      <button 
        onClick={() => nextProfile('Superlike')}
        className="flex items-center space-x-2 bg-[#8207D1] text-white font-medium py-2 px-6 rounded-full hover:bg-[#782ea7]">
        <img
          src={cupidarrow.src}
          alt="Cupid Arrow"
          className="rounded-md w-6 h-6 object-cover"
        />
        <span>Superlike</span>
      </button>
    </div>
    <p className="text-gray-900 font-medium text-md mt-2">
      If you like each other, we’ll let you know!
    </p>
  </div>
);

// Mid Section Content Components
const Section: React.FC<SectionProps> = ({ title, content, buttonText }) => (
  <div className="bg-gray-100 border border-black rounded-md p-4">
    <h3 className="text-sm font-bold mb-2">{title}</h3>
    <p className="text-sm mb-4">{content}</p>
    <button className="bg-blue-100 text-blue-600 text-sm font-semibold py-1 px-3 rounded-md hover:bg-blue-200">
      {buttonText}
    </button>
  </div>
);

const Details: React.FC<DetailsProps> = ({ title, details }) => (
  <div className="bg-gray-100 border border-black rounded-md p-4">
    <h3 className="text-sm font-bold text-pink-600 mb-4">{title}</h3>
    <ul className="text-sm space-y-2">
      {details.map((detail, index) => (
        <li key={index} className="flex items-center space-x-2">
          <span>{detail}</span>
        </li>
      ))}
    </ul>
  </div>
);

const MidSection: React.FC = () => {
  const [profile, setProfile] = useState(dummyFemales[0]);
  const [shuffledProfiles, setShuffledProfiles] = useState(dummyFemales);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current profile index

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    let shuffledArray = [...array]; // Make a copy of the array to prevent mutation of the original one
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };

  useEffect(() => {
    // Shuffle the dummyFemales array and set the first item as the profile
    const shuffled = shuffleArray(dummyFemales);
    setShuffledProfiles(shuffled); // Set shuffled list in state if you need to use it elsewhere
    setProfile(shuffled[0]); // Set the first item from the shuffled list
  }, []);

  // Function to move to the next profile and log the action
  const nextProfile = (actionType: string) => {
    console.log(`Button clicked: ${actionType}`); // Log the action type (Pass, Like, Superlike)
    console.log("Current Profile: ", shuffledProfiles[currentIndex]);

    if(actionType === "Like" || actionType === "Superlike") {
      console.log("Initiating a Match");
      // Add the Liked Profile as a Sub-Match
      handleAddMatch(shuffledProfiles[currentIndex].id);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < shuffledProfiles.length) {
      setProfile(shuffledProfiles[nextIndex]);
      setCurrentIndex(nextIndex);
    } else {
      // Optionally, loop back to the first profile
      setProfile(shuffledProfiles[0]);
      setCurrentIndex(0);
    }
  };

  // Generate a Random Score Level
  const generateRandomScore = () => Math.floor(Math.random() * (99 - 85 + 1)) + 85;

  const handleAddMatch = async (matchingUser: number) => {
    try {
      // The API endpoint to send the POST request to
      const endpoint = `${config.baseUrl}/api/matching`; // Replace with your API URL
      console.log(matchingUser);
  
      // Data to send
      const data = {
        matched_user_id: matchingUser, // Replace with dynamic `matchingUser` properties if needed
        compatibility_score: generateRandomScore(),
        is_liked: 1,
      };
  
      // Send POST request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${config.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response
      const result = await response.json();
      console.log("Match added successfully:", result);
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };
  

  return (
    <div className="space-y-8 mt-6">
      {/* Profile Header */}
      <ProfileHeader
        name={profile.name}
        location={profile.location}
        age={profile.age}
        matchPercentage={profile.matchPercentage}
        profileImage={profile.profileImage}
        nextProfile={nextProfile}  // Passing nextProfile to ProfileHeader
      />

      {/* Mid-Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Left Side */}
        <div className="space-y-4">
          <Section
            title="Current goal"
            content={profile.bio}
            buttonText="Intro"
          />
          <Section title="I like to make" content={profile.reason} buttonText="Intro" />
          <Section
            title="Interests"
            content={profile.interests.join(", ")}
            buttonText="Intro"
          />
        </div>

        {/* Right Side */}
        <div>
          <Details title="Details" details={profile.details} />
        </div>
      </div>
    </div>
  );
};

export default MidSection;
