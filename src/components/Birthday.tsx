"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/Redux/Store";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { setUserDetails } from "../app/Redux/Reducers/userSlice"; // Assuming you have a user slice

const Birthday: React.FC = () => {
  const user = useSelector((state: RootState) => state.user); // Accessing user data from Redux
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const dispatch = useDispatch();
  
  const [date, setDate] = useState({ month: "", day: "", year: "" });
  const [error, setError] = useState("");

  // Set the initial state based on the user's birthday from Redux
  useEffect(() => {
    if (user.birthday) {
      const [year, month, day] = user.birthday.split("-"); // Split the YYYY-MM-DD string
      setDate({ month, day, year }); // Set state with the extracted values
    }
  }, [user.birthday]); // Run effect only when the birthday is updated

  const isValidDate = (month: number, day: number, year: number): boolean => {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const isOver18 = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const inputDate = new Date(year, month - 1, day);
    return inputDate <= adultDate;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { month, day, year } = date;
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const yearNum = parseInt(year);

    if (!isValidDate(monthNum, dayNum, yearNum)) {
      setError("Please enter a valid date.");
      return;
    }

    if (!isOver18(yearNum, monthNum, dayNum)) {
      setError("You must be at least 18 years old.");
      return;
    }

    setError("");

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

    console.log("Formatted Birthday entered:", formattedDate);

    // Dispatch the formatted date to the Redux store
    dispatch(setUserDetails({ birthday: formattedDate }));

    // Move to the next step
    dispatch(incrementStep());
  };

  const handleChange = (field: string, value: string) => {
    setDate((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label className="font-medium text-gray-700">Enter your birthday:</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="DD"
            maxLength={2}
            value={date.day}
            onChange={(e) => handleChange("day", e.target.value)}
            className="border border-gray-300 rounded p-2 w-1/3 text-center text-gray-900"
          />
          <input
            type="text"
            placeholder="MM"
            maxLength={2}
            value={date.month}
            onChange={(e) => handleChange("month", e.target.value)}
            className="border border-gray-300 rounded p-2 w-1/3 text-center text-gray-900"
          />
          <input
            type="text"
            placeholder="YYYY"
            maxLength={4}
            value={date.year}
            onChange={(e) => handleChange("year", e.target.value)}
            className="border border-gray-300 rounded p-2 w-1/3 text-center text-gray-900"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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

export default Birthday;
