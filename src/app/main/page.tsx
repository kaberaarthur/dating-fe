"use client";
import React, { useState, useEffect } from "react";
import Modal from "./Modal/Modal";
import joto from "../../../public/joto.png";
import socialpendo from "../../../public/socialpendo.png";
import fire from "../../../public/fire.png";
import sampleProfile from "../../../public/avatar.jpg";

import Footer from "./Footer/Footer";
import MidSection from './MidSection/MidSection';
import Likes from './Likes/Likes';
import Messages from './Messages/Messages';
import Premium from './Premium/Premium';
import Superlikes from './Superlikes/Superlikes';
import Profile from './Profile/Profile';
import Details from './Details/Details';
import ImageUpload from './ImageUpload/ImageUpload';


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

import { useNavigate } from "react-router-dom";

interface Profile {
  images_updated: number;
  details_updated: number;
}

interface Image {
  id: number;
  user_id: number;
  image_url: string;
  is_profile_picture: number;
  uploaded_at: string;
}

export const goToMessages = (dispatch: any) => {
  dispatch(setActiveLink("messages"));
};

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const activeLink = useSelector((state: RootState) => state.activeLink.activeLink);
  const user = useSelector((state: RootState) => state.user);
  const accessToken = localStorage.getItem("accessToken");

  const [profile, setProfile] = useState<Profile | null>(null);

  const navigate = useNavigate();

  const [images, setImages] = useState<Image[]>([]);
  const [profileImage, setProfileImage] = useState<Image | null>(null);
  
    useEffect(() => {
      const fetchImages = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("No access token found");
          return;
        }
  
        try {
          const response = await fetch("http://localhost:5000/api/new-image-upload/images", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          if (!response.ok) {
            console.log("Failed to fetch images");
          }
  
          const data = await response.json();
          setImages(data.images); // Assuming the response contains an `images` array
          console.log(data.images);

          // Find the profile picture
          const profilePic = data.images.find((img: Image) => img.is_profile_picture === 1);
          if (profilePic) {
            setProfileImage(profilePic);
          }

        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
  
      fetchImages();
    }, []);

  // Function to determine and dispatch the correct navigation action
  const handleProfileRedirect = (profileData: Profile) => {
    if (profileData.details_updated === 0) {
      dispatch(setActiveLink("details")); // Prioritize details if not updated
    } else if (profileData.images_updated === 0) {
      dispatch(setActiveLink("imageupload")); // Only images need updating
    }
  };

  useEffect(() => {
    if (!accessToken) {
      setError("Access token is missing");
      setLoading(false);
      return; // Early exit if no accessToken
    }

    const fetchProfileData = async () => {
      try {
        const profileRes = await fetch("/backend/api/user-profiles/my-profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileRes.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData: Profile = await profileRes.json();
        setProfile(profileData); // Save profile data to state
        console.log("The User Now: ", profileData);

        // Check details_updated and images_updated
        if (profileData.details_updated === 0) {
          dispatch(setActiveLink("details")); // Prioritize details if not updated
        } else if (profileData.images_updated === 0) {
          dispatch(setActiveLink("imageupload")); // Only images need updating
        }

      } catch (error) {
        setError("Failed to load profile data");
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [accessToken, dispatch]);

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
          console.log("No subscription record found.");
            setSubscriptionPaid(false);
        }

        const data = await response.json();
        setSubscriptionPaid(data.isPaid);
        console.log("User has a subscription: ", data.isPaid)
        
      } catch (error) {
        console.log("Error checking subscription:", error);
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

    // Check if profile is loaded
    if (profile) {
      handleProfileRedirect(profile);
    }

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
                href="/people"
                className={`text-sm font-medium ${activeLink === "users" ? "text-violet-500" : "text-white"} hover:text-violet-500`}
                onClick={() => navigate("/people")}
              >
                Admin
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


            <button
              className="bg-orange-500 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-orange-600 flex items-center space-x-2"
              onClick={() => handleLinkClick("superlikes")}
            >
              <span>Buy Superlikes</span>
              <img src={fire.src} alt="Fire Icon" className="h-5 w-5" />
            </button>

            {/** Profile Page */}
            <div
              onClick={() => handleLinkClick("profile")}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
              <img
                src={profileImage 
                  ? `http://localhost:5000/api/new-image-upload/uploads/${profileImage.image_url}` 
                  : sampleProfile.src} // Fallback if profileImage is null
                alt={profileImage 
                  ? `User Image - ${profileImage.image_url}` 
                  : "Default Profile"}
                className="w-8 h-8 object-cover rounded-full" // Added 'rounded-full' for a circular shape
              />
            </div>
            {/** Profile Page */}

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
          href="/people"
          className="block py-2"
          onClick={() => handleLinkClick("users")}
        >
          Admin
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

            <button
              className="bg-orange-500 text-white text-sm font-semibold py-2 px-6 rounded-sm hover:bg-orange-600 w-full flex items-center space-x-2 justify-center"
              onClick={() => handleLinkClick("superlikes")}
            >
              <span>Buy Superlikes</span>
              <img src={fire.src} alt="Fire Icon" className="h-5 w-5" />
            </button>

            <div 
              className="flex items-center cursor-pointer hover:bg-gray-100 px-2 rounded py-4"
              onClick={() => handleLinkClick("profile")}
            >
              <img
                src={profileImage 
                  ? `http://localhost:5000/api/new-image-upload/uploads/${profileImage.image_url}` 
                  : sampleProfile.src} // Fallback if profileImage is null
                alt={profileImage 
                  ? `User Image - ${profileImage.image_url}` 
                  : "Default Profile"}
                className="h-10 w-10 rounded-full object-cover" // Matches the styling from the first snippet
              />
            </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6 bg-gray-100 text-gray-900">
        {activeLink === "discover" && <MidSection />}
        {activeLink === "likes" && <Likes />}
        {activeLink === "messages" && <Messages />}
        {activeLink === "premium" && <Premium />}
        {activeLink === "superlikes" && <Superlikes />}
        {activeLink === "profile" && <Profile />}
        {activeLink === "details" && <Details />}
        {activeLink === "imageupload" && <ImageUpload />}


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
