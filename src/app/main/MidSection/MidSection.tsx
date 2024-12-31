import React from 'react';
import model from "../../../../public/model.png";
import cupidarrow from "../../../../public/cupidarrow.png";

// Hero Icons
import { XMarkIcon, HeartIcon } from '@heroicons/react/24/solid'


type ProfileHeaderProps = {
  name: string;
  location: string;
  age: number;
  matchPercentage: number;
  profileImage: string;
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
        src={model.src}
        alt="Model Image"
        className="rounded-md w-64 h-64 object-cover"
      />
      <button className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs py-1 px-2 rounded-full hover:bg-blue-700">
        Intro
      </button>
    </div>
    {/* Interaction Buttons */}
    <div className="flex space-x-4 mt-4 text-xl">
      <button className="flex items-center space-x-2 border border-gray-700 text-gray-700 font-medium py-2 px-6 rounded-full hover:bg-gray-100">
        <XMarkIcon className="w-5 h-5" />
        <span>Pass</span>
      </button>
      <button className="flex items-center space-x-2 bg-pink-500 text-white font-medium py-2 px-6 rounded-full hover:bg-pink-600">
        <HeartIcon className="w-5 h-5" />
        <span>Like</span>
      </button>
      <button className="flex items-center space-x-2 bg-[#8207D1] text-white font-medium py-2 px-6 rounded-full hover:bg-[#782ea7]">
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
  return (
    <div className="space-y-8 mt-6">
      {/* Profile Header */}
      <ProfileHeader
        name="Chelsea"
        location="Vancouver, Washington, United States"
        age={32}
        matchPercentage={66}
        profileImage="https://via.placeholder.com/150"
      />

      {/* Mid-Section Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Left Side */}
        <div className="space-y-4">
          <Section
            title="Current goal"
            content="Hustling on my animation portfolio, trying to break into the industry =)"
            buttonText="Intro"
          />
          <Section title="I like to make" content="ART 🧐" buttonText="Intro" />
          <Section
            title="My golden rule"
            content="Do unto others as you would have them do unto you."
            buttonText="Intro"
          />
        </div>

        {/* Right Side */}
        <div>
          <Details
            title="I’M PRO-CHOICE"
            details={[
              'Woman | Straight, Demisexual | Monogamous (Single)',
              'She/Her',
              '5 ft 3 in | Thin',
              'Politically liberal | English',
              'Graduate degree (AAU) | Freelance worker | Animator (Freelance)',
              'Agnosticism | Gemini',
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default MidSection;
