"use client";
import React, { useState, useEffect } from "react";
import Modal from "./Modal/Modal";
import joto from "../../../public/joto.png";
import socialpendo from "../../../public/socialpendo.png";
import fire from "../../../public/fire.png";
import sampleProfile from "../../../public/sample-profile.jpg";

import Footer from "./Footer/Footer";
import MidSection from './MidSection/MidSection';
import Likes from './Likes/Likes';
import Messages from './Messages/Messages';
import Premium from './Premium/Premium';
import Superlikes from './Superlikes/Superlikes';


import { setUserDetails } from "../../app/Redux/Reducers/userSlice";
import { setActiveLink } from "../../app/Redux/Reducers/activeLinkSlice";

// Admin Pages
import Users from './Users/Users';
//import Messages from './Messages/Messages';

// Dummy Profiles
// import dummyProfiles from "../../app/data/dummyProfiles.json";
// import dummyMessageList from "../../app/data/dummyMessageList.json";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/Redux/Store"; 

import config from "../data/config.json";

import Link from "next/link";


export const goToMessages = (dispatch: any) => {
  dispatch(setActiveLink("messages"));
};

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const activeLink = useSelector((state: RootState) => state.activeLink.activeLink);
  const user = useSelector((state: RootState) => state.user);
  const accessToken = localStorage.getItem("accessToken");

  // console.log("Current User: ", user.user_id);

  if(!user.id) {
    window.location.href = "/login";
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [activeLink, setActiveLink] = useState<string>("discover"); // Default active link is "discover"
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State for managing hamburger menu

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Messages
  const [messages, setMessages] = useState([]);

  // Check if Client has paid Premium Subscription
  const [subscriptionPaid, setSubscriptionPaid] = useState<boolean>(false); // State for managing hamburger menu

  useEffect(() => {
    const checkSubscription = async () => {
      console.log(accessToken);

      if (!accessToken) {
        console.error("No access token found.");
        return;
      }

      if (!user.id) {
        window.location.href = "/login";
        return;
      } else {
        console.log("Current User ID: ", user.id);
      }

      try {
        const response = await fetch(`${config.baseUrl}/api/subscriptions/check-subscription`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.user_id}), // Assuming user_id is stored in localStorage
        });

        if (!response.ok) {
          throw new Error("Failed to check subscription");
        }

        const data = await response.json();
        setSubscriptionPaid(data.isPaid);
        console.log("User has a subscription: ", data.isPaid)
        
      } catch (error) {
        console.error("Error checking subscription:", error);
        setSubscriptionPaid(false);
      }
    };

    checkSubscription();
  }, [accessToken]); // Runs when accessToken changes


  // Fetch Messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${config.baseUrl}/api/messages`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Include token
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setMessages(data); // Save the messages in state

        console.log("New Messages: ", data);
    } catch (err: unknown) {
        console.error("Error fetching likes:", error);
        setError("An error occurred when fetching messages"); // Set error message
    } finally {
        setLoading(false); // Stop loading state
    }
  };

  useEffect(() => {
      fetchMessages();
  }, [accessToken]);

  // Function to handle link click and set active component
  const handleLinkClick = (link: string) => {
    dispatch(setActiveLink(link));
    setIsMenuOpen(false); // Close menu after selecting a link
  };


  const handleLogout = async () => {
    
  
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
            </div>
          </div>

          {/* Right Section (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            {!subscriptionPaid && (
              <button
                className="bg-[#8207D1] text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-[#6a05a7]"
                onClick={() => handleLinkClick("premium")}
              >
                Get Premium
              </button>
            )}

            <Link href={`/profile/${user.id}`}>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
                <img
                  src={sampleProfile.src} // Use a fallback image if `profilePicture` is missing
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <p className="px-2 text-white font-medium">{user.name}</p>
              </div>
            </Link>

            <button
              className="bg-orange-500 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-orange-600 flex items-center space-x-2"
              onClick={() => handleLinkClick("superlikes")}
            >
              <span>Buy Superlikes</span>
              <img src={fire.src} alt="Fire Icon" className="h-5 w-5" />
            </button>

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

        {/* Mobile buttons and profile */}
        <div className="mt-4 space-y-4">
          {!subscriptionPaid && (
            <button
              className="bg-[#8207D1] text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-[#6a05a7] w-full"
              onClick={() => handleLinkClick("premium")}
            >
              Get Premium
            </button>
          )}

          <Link href={`/profile/${user.id}`}>
              <div className="flex items-center cursor-pointer hover:bg-gray-100 px-2 rounded py-4">
                <img
                  src={sampleProfile.src} // Use a fallback image if `profilePicture` is missing
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
                <p className="px-2 text-white font-medium">{user.name}</p>
              </div>
            </Link>

            <button
              className="bg-orange-500 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-orange-600 w-full flex items-center space-x-2 justify-center"
              onClick={() => handleLinkClick("superlikes")}
            >
              <span>Buy Superlikes</span>
              <img src={fire.src} alt="Fire Icon" className="h-5 w-5" />
            </button>

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
        {activeLink === "likes" && <Likes />}
        {activeLink === "messages" && <Messages />}
        {activeLink === "premium" && <Premium />}
        {activeLink === "superlikes" && <Superlikes />}

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
