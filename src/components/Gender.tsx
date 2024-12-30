"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { setUserDetails } from "../app/Redux/Reducers/userSlice"; // Assuming you have a user slice

const Form: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const user = useSelector((state: RootState) => state.user); // Access user data from Redux
  const dispatch = useDispatch();

  const handleNext = () => {
    dispatch(incrementStep());
  };

  const [gender, setGender] = useState<string>("male"); // Default gender value is "male"

  // Set the initial gender value from the Redux store if available
  useEffect(() => {
    if (user.gender) {
      setGender(user.gender); // If the gender is already stored in Redux, set it
    }
  }, [user.gender]); // This will update the gender if it's changed in the Redux store

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Gender selected:", gender);

    // Dispatch gender value to store
    dispatch(setUserDetails({ gender })); // Assuming the user slice accepts gender
    handleNext(); // Move to the next step after submitting
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label className="font-medium text-gray-700">I am a...</label>
        <div className="border border-purple-900 rounded">
          <div className="flex items-center justify-between px-4 py-2">
            <label htmlFor="female" className="text-gray-700">
              Female
            </label>
            <input
              type="radio"
              id="female"
              name="gender"
              value="female" // Value is 'female' (stored value)
              checked={gender === "female"} // Checked if gender matches 'female'
              onChange={(e) => setGender(e.target.value)} // Set gender state to 'female'
              className="text-purple-900"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <label htmlFor="male" className="text-gray-700">
              Male
            </label>
            <input
              type="radio"
              id="male"
              name="gender"
              value="male" // Value is 'male' (stored value)
              checked={gender === "male"} // Checked if gender matches 'male'
              onChange={(e) => setGender(e.target.value)} // Set gender state to 'male'
              className="text-purple-900"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Form;
