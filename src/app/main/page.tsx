"use client";
import React, { useState } from "react";
import Modal from "./Modal/Modal";
import joto from "../../../public/joto.png";
import socialpendo from "../../../public/socialpendo.png";
import fire from "../../../public/fire.png";
import sampleProfile from "../../../public/sample-profile.jpg";

import Footer from "./Footer/Footer";
import MidSection from './MidSection/MidSection';
import Likes from './Likes/Likes';
import Messages from './Messages/Messages';

// Admin Pages
import Users from './Users/Users';
//import Messages from './Messages/Messages';


// Dummy Profiles
import dummyProfiles from "../../app/data/dummyProfiles.json";
import dummyMessageList from "../../app/data/dummyMessageList.json";

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [activeLink, setActiveLink] = useState<string>("discover"); // Default active link is "discover"

  // Function to handle link click and set active component
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div>
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-gray-900 shadow-md">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <img src={socialpendo.src} alt="Social Pendo Logo" className="h-10 w-auto" />
            <a
              href="#"
              className={`text-sm font-medium ${activeLink === "discover" ? "text-violet-500" : "text-white"} hover:text-violet-500`}
              onClick={() => handleLinkClick("discover")}
            >
              Discover
            </a>
            <a
              href="#"
              className={`text-sm font-medium ${activeLink === "likes" ? "text-violet-500" : "text-white"} hover:text-violet-500`}
              onClick={() => handleLinkClick("likes")}
            >
              Likes
            </a>
            <a
              href="#"
              className={`text-sm font-medium ${activeLink === "messages" ? "text-violet-500" : "text-white"} hover:text-violet-500`}
              onClick={() => handleLinkClick("messages")}
            >
              Messages
            </a>

            {/* Admin Pages */}
            <a
              href="#"
              className={`text-sm font-medium ${activeLink === "users" ? "text-violet-500" : "text-white"} hover:text-violet-500`}
              onClick={() => handleLinkClick("users")}
            >
              Users
            </a>
            <a
              href="#"
              className={`text-sm font-medium ${activeLink === "subscriptions" ? "text-violet-500" : "text-white"} hover:text-violet-500`}
              onClick={() => handleLinkClick("subscriptions")}
            >
              Subscriptions
            </a>
            <a
              href="#"
              className={`text-sm font-medium ${activeLink === "superlikes" ? "text-violet-500" : "text-white"} hover:text-violet-500`}
              onClick={() => handleLinkClick("superlikes")}
            >
              Superlikes
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            <button
              className="bg-[#8207D1] text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-[#6a05a7]"
              onClick={() => setIsModalOpen(true)}
            >
              Get Premium
            </button>

            <button
              className="bg-orange-500 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-orange-600 flex items-center space-x-2"
            >
              <span>Boost</span>
              <img src={fire.src} alt="Fire Icon" className="h-5 w-5" />
            </button>

            <img
              src={sampleProfile.src}
              alt="Profile"
              className="h-10 w-10 rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
      {/* Navbar */}

      {/* Content Section */}
      <div className="p-6 space-y-6 bg-gray-100 text-gray-900">
        {activeLink === "discover" && <MidSection />}
        {activeLink === "likes" && <Likes profiles={dummyProfiles} />}
        {activeLink === "messages" && <Messages messageList={dummyMessageList} />}

        {/* Admin Pages */}
        {activeLink === "users" && <Users />}
        {activeLink === "payments" && <MidSection />}
        {activeLink === "subscriptions" && <MidSection />}
      </div>

      {/* Footer Section */}
      <Footer />
      {/* Footer Section */}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
