import React, { useEffect, useState } from 'react';
import config from "../../data/config.json";

// Interface for the Like data
interface Like {
  match_id: number;
  compatibility_score: string;
  is_liked: number;
  is_mutual: number;
  matched_date: string;
  matched_user_name: string;
  date_of_birth: string;
  reason: string;
  interests: string;  // interests is a string containing a JSON array
  profile_picture: string;
  age?: number; // Optionally store age here
}

// Function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);  // Convert the string into a Date object
  const currentDate = new Date();  // Get the current date
  let age = currentDate.getFullYear() - birthDate.getFullYear();  // Calculate the difference in years
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();  // Check if birthday has passed this year

  // If the birthday hasn't passed yet this year, subtract 1 from the age
  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const Likes: React.FC = () => {
  const [likesData, setLikesData] = useState<Like[]>([]); // State to store likes data

  useEffect(() => {
    const fetchLikes = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token is missing.");
        return;
      }

      try {
        const response = await fetch(`${config.baseUrl}/api/matching/mylikes`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Likes data:", data);

        // Calculate age for each like
        const likesWithAge = data.map((like: Like) => {
          const age = calculateAge(like.date_of_birth);  // Calculate age using the helper function
          return { ...like, age }; // Add calculated age to the like data
        });

        setLikesData(likesWithAge); // Update state with the fetched data and calculated age
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, []); // Empty dependency array means this runs once after the component mounts

  const handleMatchUser = (userName: string) => {
    console.log(`Matched with user: ${userName}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto min-h-80 lg:min-h-screen py-16 items-center justify-center">
      {/* Check if there are no likes */}
      {likesData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={"/moyo2.gif"} // Use the profile_picture field from likes data
            alt={"Love Heartbeat Image"}
            className="w-64 h-64 rounded-sm object-cover"
          />
          <p className="text-lg font-semibold mb-4">You currently have ZERO likes. Buy Socialpendo Premium to get recommended more.</p>
          <button className="bg-purple-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-900">
            Get Premium Social Pendo
          </button>
        </div>
      ) : (
        // Display likes if there are any
        likesData.map((like) => {
          // Parse the stringified JSON array into an actual array
          const interestsArray = like.interests ? JSON.parse(like.interests) : [];

          return (
            <div
              key={like.match_id}
              className="flex items-center p-4 border rounded-lg shadow-sm bg-white"
            >
              {/* Profile Picture */}
              <img
                src={like.profile_picture} // Use the profile_picture field from likes data
                alt={like.matched_user_name}
                className="w-24 h-24 rounded-sm object-cover"
              />
              {/* Profile Info and Match User Button */}
              <div className="ml-4 flex flex-col w-full">
                <div className="flex flex-col">
                  <h2 className="font-bold text-lg">{like.matched_user_name}</h2>
                  <p className="text-sm text-gray-600">
                    {like.age} years old • {interestsArray.join(', ')} {/* Display age and interests */}
                  </p>
                </div>

                {/* Match User Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleMatchUser(like.matched_user_name)}
                    className="w-full bg-purple-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-900 text-center"
                  >
                    Match With {like.matched_user_name}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Likes;
