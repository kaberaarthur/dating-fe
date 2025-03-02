import { useState, useEffect } from "react";

// Set Menu Item for Additional Profile Details
import { setActiveLink } from "../../../app/Redux/Reducers/activeLinkSlice";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/Redux/Store"; 

import config from "../../data/config.json";

const Details: React.FC = () => {
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("10");
  const [fitness, setFitness] = useState<string>("Athletic");
  const [education, setEducation] = useState<string>("Bachelor's degree");
  const [career, setCareer] = useState<string>("Tech entrepreneur");
  const [careerOther, setCareerOther] = useState<string>("");
  const [religion, setReligion] = useState<string>("Christianity");
  const [religionOther, setReligionOther] = useState<string>("");
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);

  // Use `useDispatch` to dispatch actions
    const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Adjust if stored differently
        if (!accessToken) {
          console.error("No access token found");
          return;
        }
  
        const response = await fetch(`${config.baseUrl}/api/user-profiles/one`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("User Profile:", data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
  
    fetchUserProfile();
  }, []);

  const options: Record<string, string[]> = {
    fitness: ["Athletic", "Average", "Slim", "Heavy"],
    education: ["High School", "Associate's degree", "Bachelor's degree", "Master's degree", "PhD"],
    career: ["Tech entrepreneur", "Engineer", "Artist", "Doctor", "Other"],
    religion: ["Agnosticism", "Christianity", "Islam", "Hinduism", "Other"]
  };

  const isButtonDisabled = !heightFt || !heightIn || !fitness || !education || !career || (career === "Other" && !careerOther) || !religion || (religion === "Other" && !religionOther);

  const handleSubmit = async () => {
    const profileData = {
      height: `${heightFt}ft${heightIn}`,
      fitness,
      education,
      career: career === "Other" ? careerOther : career,
      religion: religion === "Other" ? religionOther : religion
    };

    try {
      const response = await fetch(`${config.baseUrl}/api/user-profiles/one`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Failed to update profile");
      
      setAlert({ message: "Profile updated successfully!", type: "success" });

      // Redirect user to main Page
      // Set the Menu Item Here so that user can update details plus upload images
        dispatch(setActiveLink("imageupload"));
    
        // If a user already exists, redirect user to home page
        window.location.href = "/main";

    } catch (error) {
      setAlert({ message: "Error updating profile", type: "error" });
    }
    
    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] border">
        <div className="text-center">
            <h2 className="text-4xl font-bold text-pink-700">Details</h2>
        </div>

        <div className="mt-4">
          <label className="block font-semibold">Height</label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              className="w-20 p-2 border rounded mt-1" 
              value={heightFt} 
              onChange={(e) => setHeightFt(e.target.value)} 
            />
            <span className="self-center">ft</span>
            <input 
              type="text" 
              className="w-20 p-2 border rounded mt-1" 
              value={heightIn} 
              onChange={(e) => setHeightIn(e.target.value)} 
            />
            <span className="self-center">in</span>
          </div>
        </div>

        {Object.entries(options).map(([key, values]) => (
          <div key={key} className="mt-4">
            <label className="block font-semibold capitalize">{key}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {values.map((option) => (
                <button
                  key={option}
                  className={`p-2 rounded border ${eval(key) === option ? 'bg-purple-900 text-white' : 'bg-gray-200'}`}
                  onClick={() => {
                    switch (key) {
                      case "fitness": setFitness(option); break;
                      case "education": setEducation(option); break;
                      case "career": setCareer(option); setCareerOther(""); break;
                      case "religion": setReligion(option); setReligionOther(""); break;
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            {((key === "career" && career === "Other") || (key === "religion" && religion === "Other")) && (
              <input 
                type="text" 
                className="w-full p-2 border rounded mt-2" 
                placeholder={`Enter your ${key}`} 
                value={key === "career" ? careerOther : religionOther} 
                onChange={(e) => key === "career" ? setCareerOther(e.target.value) : setReligionOther(e.target.value)}
              />
            )}
          </div>
        ))}

        

        {alert && (
          <div className={`p-3 rounded text-white ${alert.type === "success" ? "bg-green-500" : "bg-red-500"} text-center mt-4`}>
            {alert.message}
          </div>
        )}

        <button 
          className={`w-full mt-6 py-2 rounded ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 text-white'}`} 
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Details;
