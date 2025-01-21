import React, {useEffect, useState} from 'react';
import config from "../../data/config.json";


interface Profile {
  id: number;
  name: string;
  age: number;
  interests: string[];
  profilePicture: string;
}

interface LikesProps {
  profiles: Profile[];
}

const Likes: React.FC<LikesProps> = ({ profiles }) => {
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
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, []);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center p-4 border rounded-lg shadow-sm bg-white"
        >
          {/* Profile Picture */}
          <img
            src={profile.profilePicture}
            alt={profile.name}
            className="w-16 h-16 rounded-sm object-cover"
          />
          {/* Profile Info */}
          <div className="ml-4">
            <h2 className="font-bold text-lg">{profile.name}</h2>
            <p className="text-sm text-gray-600">
              {profile.age} years old • {profile.interests.join(', ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Likes;
