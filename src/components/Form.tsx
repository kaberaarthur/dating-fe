"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { RootState } from "../app/Redux/Store";
import { setUserDetails } from "../app/Redux/Reducers/userSlice";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6LeYV-8qAAAAAG7fJH8qaeUjBS_ZVl17qGfrPof0"; // Replace with your actual site key
const SECRET_KEY = "6LeYV-8qAAAAAC4QvkTUwCddjGUqup9Y3wnmbMBr"; 

const Form: React.FC = () => {
  const currentStep = useSelector((state: any) => state.step.currentStep);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>(user.email);
  const [error, setError] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }

    setError("");
    console.log("Email submitted:", email);
    dispatch(incrementStep());
    dispatch(setUserDetails({ email })); // Dispatch only the email
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label htmlFor="email" className="font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className={`border p-2 rounded text-gray-900 ${
            error ? "border-red-500" : "border-purple-300"
          }`}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <ReCAPTCHA sitekey={SITE_KEY} onChange={(token: any) => setCaptchaToken(token)} />

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
