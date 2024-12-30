"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";

interface ApiResponse {
  message: string;
  status: string;
}

const TestPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/register-test");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: ApiResponse = await res.json();
        console.log("Response Data:", data);
        setResponse(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError((err as Error).message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <h2>User State:</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <h2>API Response:</h2>
      {response ? <pre>{response}</pre> : error ? <pre>{error}</pre> : <p>Loading...</p>}
    </div>
  );
};

export default TestPage;
