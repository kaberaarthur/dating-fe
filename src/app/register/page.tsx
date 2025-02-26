"use client";
import React from "react";
import { incrementStep, decrementStep } from "../Redux/Reducers/stepSlice"; // Import the incrementStep action
import Form from "../../components/Form";
import Name from "../../components/Name";
import Gender from "../../components/Gender";
import Birthday from "../../components/Birthday";
import PhoneNumber from "../../components/PhoneNumber";
import AddBio from "../../components/AddBio";
import Reason from "../../components/Reason";
import Interests from "../../components/Interests";
import Location from "../../components/Location";
import Password from "../../components/Password";

// Hero Icons
import { BackwardIcon, CalendarDaysIcon, EnvelopeIcon, UserIcon, CubeIcon, PhoneIcon, CheckBadgeIcon, EyeDropperIcon, ListBulletIcon, KeyIcon } from '@heroicons/react/24/solid'
import { MapPinIcon } from "@heroicons/react/16/solid";

// Set Menu Item for Additional Profile Details
import { setActiveLink } from "../../app/Redux/Reducers/activeLinkSlice";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/Redux/Store"; 


const EmailPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  // Use `useDispatch` to dispatch actions
  const dispatch = useDispatch();

  if(user.id) {
    // Set the Menu Item Here so that user can update details plus upload images
    dispatch(setActiveLink("details"));

    // If a user already exists, redirect user to home page
    window.location.href = "/main";
  }

  // Use `useSelector` to get the `currentStep` from the Redux store
  const currentStep = useSelector((state: any) => state.step.currentStep);

  const steps = [
    { component: <Form />, title: "What's Your Email Address?", icon: EnvelopeIcon },
    { component: <Password />, title: "Enter a Password", icon: KeyIcon },
    { component: <Name />, title: "Enter Your Name", icon: UserIcon },
    { component: <Gender />, title: "Select Your Gender", icon: CubeIcon },
    { component: <Birthday />, title: "When Were You Born?", icon: CalendarDaysIcon },
    { component: <PhoneNumber />, title: "Enter Your Phone Number", icon: PhoneIcon },
    { component: <AddBio />, title: "Add a Short Bio", icon: CheckBadgeIcon },
    { component: <Reason />, title: "Why Are You Here?", icon: EyeDropperIcon },
    { component: <Location />, title: "Where Are You Located?", icon: MapPinIcon },
    { component: <Interests />, title: "Select Your Interests", icon: ListBulletIcon },
  ];

  const handleNext = () => {
    // Dispatch the action to increment the step in the store
    dispatch(incrementStep());
  };

  const handlePrevious = () => {
    // Dispatch the action to increment the step in the store
    dispatch(decrementStep());
  };

  return (
    <div className="bg-gray-900">
      <div className="px-4 py-12 mx-auto lg:py-8 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 bg-gray-900">
        {/* Backward Icon positioned above */}
        <div className="relative flex flex-col items-start space-y-4">
          <BackwardIcon 
            className="h-6 w-6 text-white cursor-pointer" 
            onClick={handlePrevious} 
          />

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

      <div className="grid grid-cols-1 px-8 pt-20 pb-48 lg:min-h-screen bg-gray-100">
        {steps[currentStep].component}
      </div>
    </div>
  );
};

export default EmailPage;
