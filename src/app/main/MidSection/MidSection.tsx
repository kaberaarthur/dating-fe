import React, { useState, useEffect } from "react";
import model from "../../../../public/model.png";
import cupidarrow from "../../../../public/cupidarrow.png";
import config from "../../data/config.json";
import { motion } from "framer-motion";
// Hero Icons
import { XMarkIcon, HeartIcon } from "@heroicons/react/24/solid";

// Images Display
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Define the type for user images
type UserImage = {
  id: number;
  user_id: number;
  image_url: string;
  is_profile_picture: number;
  uploaded_at: string;
};

// Define the type for endpoint profile data
type EndpointProfile = {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  profile_picture: string;
  images_updated: number;
  details_updated: number;
  county: string | null;
  town: string | null;
  date_of_birth: string;
  gender: string;
  interests: string;
  bio: string;
  reason: string;
  height: string | null;
  fitness: string | null;
  education: string | null;
  career: string | null;
  religion: string | null;
  last_login: string;
  active: number;
  phone: string;
  email: string;
  user_type: string;
  // Add the images array
  images: UserImage[];
};

// Transform endpoint profile type to match UI needs
type TransformedProfile = {
  id: number;
  user_id: number;
  name: string;
  age: number;
  location: string;
  matchPercentage: number;
  profileImage: string;
  bio: string;
  reason: string;
  interests: string[];
  gender: string;
  county: string | null;
  town: string | null;
  active: number;
  details: string[];
  images: UserImage[];
};

type ProfileHeaderProps = {
  id: number;
  user_id: number;
  name: string;
  location: string;
  age: number;
  matchPercentage: number;
  profileImage: string;
  images: UserImage[];
  nextProfile: (actionType: string) => void;
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

// Interface for superlikes count response from superlikes_record
interface SuperlikesRecord {
  amount: number;
}

// Animation variants for the 5 emojis
const emojiVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: [0, 1, 0],
    scale: [0, 1.5, 1],
    y: [0, -20, -40],
    transition: {
      delay: i * 0.2, // Stagger each emoji by 0.2 seconds
      duration: 0.8,
      times: [0, 0.5, 1],
    },
  }),
};

// Profile Header Component
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  id,
  name,
  location,
  age,
  matchPercentage,
  profileImage,
  images,
  nextProfile,
}) => {
  const [showEmojis, setShowEmojis] = useState(false);

  // Handle Like button click with animation
  const handleLikeClick = () => {
    setShowEmojis(true); // Trigger emoji animation
  };

  // Reset emojis and proceed to next profile after animation
  const onAnimationComplete = () => {
    setShowEmojis(false); // Reset emoji state
    nextProfile("Like"); // Proceed to next profile
  };

  // Array of emojis to display
  const emojis = ["💖", "💕", "😍", "💓", "💗"];

  return (
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
      {/* Replace with Dynamic Images */}
      <div className="w-full h-full mb-4 rounded-lg overflow-hidden border">
          {images.length > 0 ? (
            <Slider 
                dots 
                infinite 
                speed={500} 
                slidesToShow={1} 
                slidesToScroll={1} 
                autoplay 
                autoplaySpeed={3000}
                arrows={true}
              >
              {images.map((image) => (
                <div key={image.id}>
                  <img
                    src={`${config.baseUrl}/api/new-image-upload/uploads/${image.image_url}`}
                    alt={`User Image - ${image.image_url}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img src={"/avatar.jpg"} alt={name} className="w-full h-full object-cover" />
          )}
        </div>
      
      {/* Interaction Buttons */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 text-xl justify-center">
        <button
          onClick={() => nextProfile("Pass")}
          className="flex items-center justify-center space-x-2 border border-gray-700 text-gray-700 font-medium py-2 px-6 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon className="w-5 h-5" />
          <span>Pass</span>
        </button>
        <button
          onClick={handleLikeClick}
          className="relative flex items-center justify-center space-x-2 bg-pink-500 text-white font-medium py-2 px-6 rounded-full hover:bg-pink-600"
        >
          <HeartIcon className="w-5 h-5" />
          {showEmojis && (
            <>
              {emojis.map((emoji, index) => (
                <motion.div
                  key={index}
                  className="absolute text-2xl"
                  custom={index} // Pass index for staggered delay
                  variants={emojiVariants}
                  initial="hidden"
                  animate="visible"
                  onAnimationComplete={index === emojis.length - 1 ? onAnimationComplete : undefined} // Trigger nextProfile only after last emoji
                >
                  {emoji}
                </motion.div>
              ))}
            </>
          )}
          <span>Like</span>
        </button>
        <button
          onClick={() => nextProfile("Superlike")}
          className="flex items-center justify-center space-x-2 bg-[#8207D1] text-white font-medium py-2 px-6 rounded-full hover:bg-[#782ea7]"
        >
          <img
            src={cupidarrow.src}
            alt="Cupid Arrow"
            className="rounded-md w-6 h-6 object-cover"
          />
          <span>Superlike</span>
        </button>
      </div>
      <p className="text-gray-900 font-medium text-md mt-2">
        If you like each other, we'll let you know!
      </p>
    </div>
  );
};

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

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
};

// Helper function to transform endpoint profile to the format needed by UI
const transformProfile = (profile: EndpointProfile): TransformedProfile => {
  // Parse interests from string to array
  let interestsArray: string[] = [];
  try {
    interestsArray = JSON.parse(profile.interests);
  } catch (e) {
    // If parsing fails, make a fallback array
    interestsArray = profile.interests ? [profile.interests] : [];
  }

  // Format location
  const location = [
    profile.town,
    profile.county
  ].filter(Boolean).join(", ");

  // Calculate age from date of birth
  const age = calculateAge(profile.date_of_birth);

  // Format details array similar to dummy data
  const details = [
    `${profile.gender === 'male' ? 'Man' : 'Woman'} | ${profile.reason}`,
    profile.height || "Height not specified",
    profile.fitness ? `${profile.fitness} Build` : "Build not specified",
    profile.education || "Education not specified",
    profile.career ? `${profile.career}` : "Career not specified",
    profile.religion || "Religion not specified"
  ].filter(Boolean);

  // Generate random match percentage between 65-95%
  const matchPercentage = Math.floor(Math.random() * (95 - 65 + 1)) + 65;

  return {
    id: profile.id,
    user_id: profile.user_id,
    name: profile.name,
    age,
    location,
    matchPercentage,
    profileImage: profile.profile_picture,
    bio: profile.bio || "No bio available",
    reason: profile.reason || "Reason not specified",
    interests: interestsArray,
    gender: profile.gender,
    county: profile.county,
    town: profile.town,
    active: profile.active,
    details,
    images: profile.images,
  };
};

const MidSection: React.FC = () => {
  // State for API profiles
  const [profiles, setProfiles] = useState<EndpointProfile[]>([]);
  const [transformedProfiles, setTransformedProfiles] = useState<TransformedProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<TransformedProfile | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handle Superlikes Stuff
  const [superlikesModal, setSuperlikesModal] = useState(false);
  const [superlikeCount, setSuperlikeCount] = useState(1);
  const [maxSuperlikes, setMaxSuperlikes] = useState<number | null>(null);

  const [superlikesLoading, setSuperlikesLoading] = useState(false);
  const [superlikesError, setSuperlikesError] = useState<string>("");

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Fetch maximum superlikes from superlikes_record
  useEffect(() => {
    const fetchMaxSuperlikes = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setSuperlikesError("No access token found");
        return;
      }

      setSuperlikesLoading(true);
      try {
        const response = await fetch(`${config.baseUrl}/api/superlikes/count`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch maximum superlikes");
        }

        const data: SuperlikesRecord = await response.json();
        setMaxSuperlikes(data.amount); // Set the maximum superlikes from superlikes_record

        console.log("Maximum Superlikes Available: ", data.amount);
      } catch (err) {
        setSuperlikesError("An error occurred while fetching maximum superlikes");
        console.error(err);
      } finally {
        setSuperlikesLoading(false);
      }
    };

    fetchMaxSuperlikes();
  }, []);

  // Fetch profiles from API
  useEffect(() => {
    const fetchProfiles = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `${config.baseUrl}/api/user-profiles/the-profiles`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }

        const data = await response.json();
        setProfiles(data);
      } catch (err) {
        setError("An Error Occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Transform and shuffle profiles when API data is loaded
  useEffect(() => {
    if (profiles.length > 0) {
      // Transform profiles to match UI needs
      const transformed = profiles.map(transformProfile);
      
      // Shuffle the transformed profiles
      const shuffled = shuffleArray(transformed);
      
      setTransformedProfiles(shuffled);
      
      // Set the first profile as the current one
      if (shuffled.length > 0) {
        setCurrentProfile(shuffled[0]);
      }
    }
  }, [profiles]);

  // Shuffle function
  const shuffleArray = (array: any[]) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Handle sending superlikes
  const handleSendSuperlikes = async () => {
    if (!currentProfile || maxSuperlikes === null) return;
    if (superlikeCount > maxSuperlikes) {
      alert(`You cannot send more than ${maxSuperlikes} superlikes!`);
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    console.log(`Sending ${superlikeCount} Superlikes to ${currentProfile.name} of ID - ${currentProfile.id}`);

    try {
      // POST request to update superlikes_record
      const response = await fetch(`${config.baseUrl}/api/superlikes/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: currentProfile.id,
          amount: superlikeCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send superlikes");
      }

      const result = await response.json();
      console.log("Superlikes sent successfully:", result);

      // Proceed with existing logic
      // Change this to user id
      handleAddMatch(currentProfile.user_id); // Call the match function
      setMaxSuperlikes((prev) => (prev !== null ? prev - superlikeCount : null)); // Update local maxSuperlikes

      const nextIndex = (currentIndex + 1) % transformedProfiles.length;
      setCurrentIndex(nextIndex);
      setCurrentProfile(transformedProfiles[nextIndex]);
    } catch (error) {
      console.error("Error sending superlikes:", error);
      alert("An error occurred while sending superlikes. Please try again.");
      return;
    }

    // Close modal and move to next profile
    setSuperlikesModal(false);
    setSuperlikeCount(1);
  };


  // Function to move to the next profile and log the action
  const nextProfile = (actionType: string) => {
    if (!currentProfile || transformedProfiles.length === 0) return;

    console.log(`Button clicked: ${actionType}`);
    console.log("Current Profile: ", currentProfile);

    // Handle "Like" action
    if (actionType === "Pass") {
      console.log("Pass this Profile");

      const nextIndex = (currentIndex + 1) % transformedProfiles.length;
      setCurrentIndex(nextIndex);
      setCurrentProfile(transformedProfiles[nextIndex]);
    }

    // Handle "Like" action
    if (actionType === "Like") {
      console.log("Initiating a Like Match");
      handleAddMatch(currentProfile.user_id); // Add the Liked Profile as a Sub-Match

      const nextIndex = (currentIndex + 1) % transformedProfiles.length;
      setCurrentIndex(nextIndex);
      setCurrentProfile(transformedProfiles[nextIndex]);
    }

    // Handle "Superlike" action
    if (actionType === "Superlike") {
      console.log("Initiating a Superlike Match");
      setSuperlikesModal(true);
    }

  };

  // Generate a Random Score Level
  const generateRandomScore = () => Math.floor(Math.random() * (99 - 85 + 1)) + 85;

  const handleAddMatch = async (matchingUser: number) => {
    try {
      // The API endpoint to send the POST request to
      const endpoint = `${config.baseUrl}/api/matching`;
      console.log("User to be Matched with: ", matchingUser);
      

      // Data to send
      const data = {
        matched_user_id: matchingUser,
        compatibility_score: generateRandomScore(),
        is_liked: 1,
      };

      // Send POST request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  // Show loading state
  if (loading) {
    return <div className="text-center py-8">Loading profiles...</div>;
  }

  // Show error state
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  // No profiles available
  if (!currentProfile) {
    return <div className="text-center py-8">No profiles available</div>;
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Profile Header */}
      <ProfileHeader
        id={currentProfile.id}
        user_id={currentProfile.user_id}
        name={currentProfile.name}
        location={currentProfile.location}
        age={currentProfile.age}
        matchPercentage={currentProfile.matchPercentage}
        profileImage={currentProfile.profileImage}
        images={currentProfile.images}
        nextProfile={nextProfile}
      />

      {superlikesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Send Superlikes to {currentProfile.name}</h2>
            
            {/* Display Max Superlikes */}
            <p className="text-sm text-gray-600 mb-4">
              Max Superlikes: {maxSuperlikes !== null ? maxSuperlikes : "Loading..."}
            </p>

            <div className="mb-6 flex items-center justify-center space-x-2">
              {/* Subtract Button */}
              <button
                onClick={() => setSuperlikeCount((prev) => Math.max(1, prev - 1))}
                className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-300"
              >
                −
              </button>
              {/* Input */}
              <input
                type="number"
                min="1"
                max={maxSuperlikes || undefined} // Set max to maxSuperlikes
                value={superlikeCount}
                onChange={(e) =>
                  setSuperlikeCount(
                    Math.min(maxSuperlikes || Infinity, Math.max(1, parseInt(e.target.value) || 1))
                  )
                }
                className="w-20 p-2 border border-gray-300 rounded-md text-center"
              />
              {/* Add Button */}
              <button
                onClick={() =>
                  setSuperlikeCount((prev) =>
                    maxSuperlikes !== null && prev >= maxSuperlikes ? prev : prev + 1
                  )
                }
                className="bg-gray-200 text-gray-700 w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-300"
                disabled={maxSuperlikes !== null && superlikeCount >= maxSuperlikes} // Disable if at max
              >
                +
              </button>
            </div>
            <div className="flex space-x-2">
              {/* Cancel Button */}
              <button
                onClick={() => {
                  setSuperlikesModal(false);
                  setSuperlikeCount(1); // Reset on cancel
                }}
                className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              {/* Send Superlikes Button */}
              <button
                onClick={handleSendSuperlikes}
                className="w-1/2 bg-[#8207D1] text-white py-2 rounded-md hover:bg-[#782ea7]"
                disabled={maxSuperlikes !== null && superlikeCount > maxSuperlikes} // Disable if over max
              >
                Send Superlikes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the Component */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Left Side */}
        <div className="space-y-4">
          <Section
            title="Current goal"
            content={currentProfile.bio}
            buttonText="Intro"
          />
          <Section 
            title="I like to make" 
            content={currentProfile.reason} 
            buttonText="Intro" 
          />
          <Section
            title="Interests"
            content={currentProfile.interests.join(", ")}
            buttonText="Intro"
          />
        </div>

        {/* Right Side */}
        <div>
          <Details title="Details" details={currentProfile.details} />
        </div>
      </div>
    </div>
  );
};

export default MidSection;