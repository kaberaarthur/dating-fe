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
import { setUserDetails } from "../../app/Redux/Reducers/userSlice";

// Admin Pages
import Users from './Users/Users';
//import Messages from './Messages/Messages';

// Dummy Profiles
import dummyProfiles from "../../app/data/dummyProfiles.json";
import dummyMessageList from "../../app/data/dummyMessageList.json";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/Redux/Store"; 

import Link from "next/link";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  if(!user.id) {
    // A user already exists
    // Redirect to main
    window.location.href = "/login";
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>("discover"); // Default active link is "discover"
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State for managing hamburger menu

  // Function to handle link click and set active component
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsMenuOpen(false); // Close menu after selecting a link
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      console.error("No access token found in localStorage.");
      return;
    }
  
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token: accessToken }),
      });
  
      if (response.ok) {
        // Logout successful, remove tokens from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        dispatch(setUserDetails()); // Dispatch to Redux
  
        console.log("Logout successful");
        // Optionally redirect or update the UI

      } else {
        console.error("Failed to logout:", await response.json());
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  

  return (
    <div>
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-gray-900 shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <img src={socialpendo.src} alt="Social Pendo Logo" className="h-10 w-auto" />
            {/* Main Navigation links (hidden on mobile) */}
            <div className="hidden md:flex space-x-6">
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
          </div>

          {/* Right Section (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
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

            <Link href={`/profile/${user.id}`}>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
                <img
                  src={sampleProfile.src} // Use a fallback image if `profilePicture` is missing
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <p className="px-2 text-white font-medium">{user.name + " " + user.id}</p>
              </div>
            </Link>

            <button
              className="bg-purple-800 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-purple-900 flex items-center space-x-2"
              onClick={handleLogout}
            >
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="block md:hidden">
            <button
              className="text-white"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? (
                <span className="text-2xl">X</span> // "X" icon when menu is open
              ) : (
                <span className="text-2xl">☰</span> // Hamburger icon
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Navbar */}

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"} bg-gray-800 text-white px-4 py-2`}
      >
        <a
          href="#"
          className="block py-2"
          onClick={() => handleLinkClick("discover")}
        >
          Discover
        </a>
        <a
          href="#"
          className="block py-2"
          onClick={() => handleLinkClick("likes")}
        >
          Likes
        </a>
        <a
          href="#"
          className="block py-2"
          onClick={() => handleLinkClick("messages")}
        >
          Messages
        </a>

        {/* Admin Pages */}
        <a
          href="#"
          className="block py-2"
          onClick={() => handleLinkClick("users")}
        >
          Users
        </a>
        <a
          href="#"
          className="block py-2"
          onClick={() => handleLinkClick("subscriptions")}
        >
          Subscriptions
        </a>
        <a
          href="#"
          className="block py-2"
          onClick={() => handleLinkClick("superlikes")}
        >
          Superlikes
        </a>

        {/* Mobile buttons and profile */}
        <div className="mt-4 space-y-4">
          <button
            className="bg-[#8207D1] text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-[#6a05a7] w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Get Premium
          </button>

          <button
            className="bg-orange-500 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-orange-600 w-full flex items-center space-x-2 justify-center"
          >
            <span>Boost</span>
            <img src={fire.src} alt="Fire Icon" className="h-5 w-5" />
          </button>

          <Link href={`/profile/${user.id}`}>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 px-2 rounded py-4">
                <img
                  src={sampleProfile.src} // Use a fallback image if `profilePicture` is missing
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <p className="px-2 text-white font-medium">{user.name + " " + user.id}</p>
              </div>
            </Link>
            <button
              className="bg-purple-800 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-purple-900 w-full flex items-center space-x-2 justify-center"
              onClick={handleLogout}
            >
              <span>Logout</span>
            </button>
        </div>
      </div>

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
