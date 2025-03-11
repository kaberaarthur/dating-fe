import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep } from "../app/Redux/Reducers/stepSlice";
import { RootState } from "../app/Redux/Store";
import { setUserDetails } from "../app/Redux/Reducers/userSlice";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY!;
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

const Form: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState<string>(user.email);
  const [error, setError] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!isLocalhost && !captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }

    setError("");
    console.log("Email submitted:", email);
    dispatch(incrementStep());
    dispatch(setUserDetails({ email }));
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

        {!isLocalhost && (
          <ReCAPTCHA sitekey={SITE_KEY} onChange={(token) => setCaptchaToken(token)} />
        )}

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
