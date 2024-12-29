"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";

const Form: React.FC = () => {
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const dispatch = useDispatch();

  const handleNext = () => {
    dispatch(incrementStep());
  };

  const [gender, setGender] = useState<string>("man");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Gender selected:", gender);
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
            <label htmlFor="woman" className="text-gray-700">
              Woman
            </label>
            <input
              type="radio"
              id="woman"
              name="gender"
              value="woman"
              checked={gender === "woman"}
              onChange={(e) => setGender(e.target.value)}
              className="text-purple-900"
            />
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <label htmlFor="man" className="text-gray-700">
              Man
            </label>
            <input
              type="radio"
              id="man"
              name="gender"
              value="man"
              checked={gender === "man"}
              onChange={(e) => setGender(e.target.value)}
              className="text-purple-900"
            />
          </div>
        </div>

        <button
          type="submit"
          onClick={handleNext}
          className="bg-purple-900 text-white font-bold py-2 px-4 rounded hover:bg-purple-950"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Form;
