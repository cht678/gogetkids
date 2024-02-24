"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";

export default function DashboardPage() {

  const [email, setEmail] = useState("No email");

  const getUserDetails = async () => {
    try {
      const res = await axios.get('/api/dashboard');
      console.log(res.data);
      setEmail(res.data.data.email);
    } catch (error: any) {
      console.error(error.message);
      // Handle errors if necessary
    }
  };

  // Use useEffect to call getUserDetails when the component is mounted
  useEffect(() => {
    getUserDetails();
  }, []); // The empty dependency array ensures that it only runs once when the component is mounted

	return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-white">
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Dashboard</h1>
      <div className="bg-white p-6 rounded-md shadow-md text-center">
        <p className="text-gray-700">Welcome to your dashboard!</p>
        <hr className="my-4 border-t border-gray-300" />
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-blue-600">
            {email === 'No email' ? "No Email" : "Your Email:"}
          </h2>
          <p className="text-gray-800">
            {email}
          </p>
        </div>
      </div>
    </div>
  );
}
