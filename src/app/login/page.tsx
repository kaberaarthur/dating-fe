"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incrementStep, decrementStep } from "../Redux/Reducers/stepSlice"; // Import the incrementStep action

import Login from "../../components/Login";

// Hero Icons
import { BackwardIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid'
import { MapPinIcon } from "@heroicons/react/16/solid";

// Redux
import { RootState } from "../../app/Redux/Store"; 

const LoginPage: React.FC = () => {

  // Use `useSelector` to get the `currentStep` from the Redux store
  const currentStep = useSelector((state: any) => state.step.currentStep);

  const steps = [
    { component: <Login />, title: "Login to Social Pendo", icon: ArrowRightEndOnRectangleIcon },
  ];

  return (
    <div className="bg-gray-900">
      <div className="px-4 py-12 mx-auto lg:py-8 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 bg-gray-900">
        {/* Backward Icon positioned above */}
        <div className="relative flex flex-col items-start space-y-4">

          {/* Title with Calendar Icon in Background */}
          <div className="relative">
            {/* Calendar Icon as background on the right */}
            {React.createElement(steps[currentStep].icon, {
              className: "absolute top-0 right-0 text-white/10 h-24 w-24",
              "aria-hidden": "true"
            })}

            {/* Title */}
            
            <h1 className="text-4xl font-medium text-white relative z-10">
              {steps[currentStep].title}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 px-8 pb-48 bg-gray-100">
        {steps[currentStep].component}
      </div>
    </div>
  );
};

export default LoginPage;
