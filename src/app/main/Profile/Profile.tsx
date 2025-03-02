"use client"

import { useEffect, useState } from "react";
import { RootState } from "../../../app/Redux/Store";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../../../app/Redux/Reducers/userSlice";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import config from "../../data/config.json";


// Set Menu Item for Additional Profile Details
import { setActiveLink } from "../../../app/Redux/Reducers/activeLinkSlice";

interface User {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    last_login: string;
    active: number;
    phone: string;
    email: string;
    user_type: string;
    profile_picture?: string;  // Optional field for profile picture
  }

  interface Subscription {
    id: number;
    user_id: number;
    subscription_type: string;
    start_date: string;
    end_date: string;
    price: string;
    payment_method: string;
    payment_status: string;
    transaction_id: string | null;
    created_at: string;
    updated_at: string;
    plan_id: string | null;
  }

  interface Image {
    id: number;
    user_id: number;
    image_url: string;
    is_profile_picture: number;
    uploaded_at: string;
  }
  

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const dispatch = useDispatch();


  const currUser = useSelector((state: RootState) => state.user);
  const userId = currUser.id;

  console.log("User ID: ", userId);

  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await fetch(`${config.baseUrl}/api/new-image-upload/images`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data.images); // Assuming the response contains an `images` array
        console.log(data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {

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

        const profileData = await profileRes.json();
        setUser(profileData);
      } catch (error) {
        setError("Failed to load profile data");
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [accessToken]); 


  useEffect(() => {
    
    const fetchSubscriptionData = async () => {
      try {
          const subscriptionRes = await fetch("/backend/api/subscriptions/my-subscription", {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
              },
          });
  
          if (!subscriptionRes.ok) {
              throw new Error("Failed to fetch subscription data");
          }
  
          const subscriptionData: Subscription = await subscriptionRes.json();
          setSubscription(subscriptionData);
      } catch (error) {
          console.log("Error fetching subscription data:", error);
          
          // Dummy data with all required fields
          setSubscription({
              id: 0,
              user_id: 0,
              subscription_type: "Free Trial",
              start_date: "2020-01-01",
              end_date: "2040-12-31",
              price: "0",
              payment_method: "N/A",
              payment_status: "unpaid",
              transaction_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              plan_id: null,
          });
      } finally {
          setLoading(false);
      }
  };
  

    fetchSubscriptionData();
  }, [accessToken]);

  const handleLogout = async () => {
      if (!accessToken) {
        console.error("No access token found in localStorage.");
        return;
      }
    
      try {
        const response = await fetch(`${config.baseUrl}/api/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token: refreshToken }),
        });
    
        if (response.ok) {
          // Logout successful, remove tokens from localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
  
          dispatch(setUserDetails()); // Dispatch to Redux
    
          window.location.href = "/login";
  
        } else {
          console.error("Failed to logout:", await response.json());
        }
      } catch (error) {
        console.error("An error occurred during logout:", error);
      }
    };

    const redirectToDetails = async () => {
      console.log("Redirect to Update Details");
      // Set the Menu Item Here so that user can update details plus upload images
      dispatch(setActiveLink("details"));
    };


    const redirectToImageUpload = async () => {
      console.log("Redirect to Image Upload");
      // Set the Menu Item Here so that user can update details plus upload images
      dispatch(setActiveLink("imageupload"));
    };

  if (loading) {
    return <div className="h-40 w-40 rounded-full bg-gray-300 animate-pulse" />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>No user data available</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 shadow-lg rounded-xl bg-white">
      <div className="flex flex-col items-center">
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
            <img src={user.profile_picture || "/default-avatar.png"} alt={user.name} className="w-full h-full object-cover" />
          )}
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-500">{user.phone}</p>
        <div className="mt-4">
          <h3 className="text-lg font-medium">Subscriptions</h3>
          {subscription ? (
                <div>
                    <p><strong>Subscription Status:</strong> {subscription.subscription_type}</p>
                    <p><strong>Start Date:</strong> {new Date(subscription.start_date).toLocaleDateString()}</p>
                    <p><strong>Subscription Expiry Date:</strong> {new Date(subscription.end_date).toLocaleDateString()}</p>
                </div>
            ) : (
                <p>No subscription data found.</p>
            )}
        </div>

        <div className="flex justify-center items-center pt-6 w-full">
          <button 
            className="w-full px-6 py-3 bg-purple-700 text-white font-semibold rounded-sm shadow-md hover:bg-purple-800" 
            onClick={redirectToDetails}
          >
            Update Details
          </button>
        </div>

        <div className="flex justify-center items-center pt-6 w-full">
          <button 
            className="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-sm shadow-md hover:bg-orange-600" 
            onClick={redirectToImageUpload}
          >
            Upload Images
          </button>
        </div>

        <div className="flex justify-center items-center pt-6 w-full">
          <button 
            className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-sm shadow-md hover:bg-red-700" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div 
      className={className}
      style={{ 
        ...style, 
        display: "block", 
        background: "black", 
        borderRadius: "50%", 
        padding: "10px",
        left: "-30px",
        zIndex: 1000
      }} 
      onClick={onClick}
    />
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div 
      className={className}
      style={{ 
        ...style, 
        display: "block", 
        background: "black", 
        borderRadius: "50%", 
        padding: "10px",
        right: "-30px",
        zIndex: 1000
      }} 
      onClick={onClick}
    />
  );
};


export default Profile;
