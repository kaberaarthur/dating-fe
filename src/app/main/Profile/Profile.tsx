import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/Redux/Store";

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
  

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = localStorage.getItem("accessToken");


  const currUser = useSelector((state: RootState) => state.user);
  const userId = currUser.id;

  console.log("User ID: ", userId);

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
    if (!accessToken) {
      setError("Access token is missing");
      setLoading(false);
      return; // Early exit if no accessToken
    }

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

        const subscriptionData = await subscriptionRes.json();
        setSubscription(subscriptionData);
      } catch (error) {
        setError("Failed to load subscription data");
        console.log("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [accessToken]);

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
        <div className="w-40 h-40 mb-4 rounded-lg overflow-hidden border">
          <img src={user.profile_picture || "/default-avatar.png"} alt={user.name} className="w-full h-full object-cover" />
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
      </div>
    </div>
  );
};

export default Profile;
