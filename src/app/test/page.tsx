"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";

const TestPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  // console.log("User State in Test Page:", user);

  return (
    <div>
      <h1>Test Page</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default TestPage;
