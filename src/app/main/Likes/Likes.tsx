import React from 'react';

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
