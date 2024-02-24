'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import React, { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import GoGetKidsLogo from '@/app/ui/gogetkids-logo'; // Import the GoGetKidsLogo component

export default function LoginForm() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login successful");

      // Check if there's a redirect path in the response headers
      const redirectPath = response.headers['x-redirect'];
      if (redirectPath) {
        router.push(redirectPath); // Redirect to the specified path
      } else {
        router.push("/dashboard"); // Default redirect path
      }
    } catch (error: any) {
      console.log("Login failed", error.message);

      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error;

        // Check for specific error messages
        if (errorMessage.includes("User not found")) {
          toast.error("User not found. Please check your email.");
        } else if (errorMessage.includes("Invalid password")) {
          toast.error("Invalid password. Please double-check your password.");
        } else {
          // Display a generic error message for other errors
          toast.error(errorMessage);
        }
      } else {
        // Display a generic error message for other errors
        toast.error("Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="mb-8">
        <GoGetKidsLogo darkFont={true} />
      </div>
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4 text-center`}>
          {loading ? 'Processing' : 'Enter credentials to login.'}
        </h1>
        <div>
          <label className="block text-xs font-medium text-gray-900" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter email"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-10 text-sm outline-none placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter password"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-10 text-sm outline-none placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={onLogin}
            disabled={buttonDisabled}
            className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300'}`}
          >
            {buttonDisabled ? 'Please enter login details' : 'Login'} <ArrowRightIcon className="ml-1 h-5 w-5 text-gray-50" />
          </Button>
        </div>
        <Link href="/signup" className="block text-center text-blue-500 hover:underline">
          Visit Sign Up Page
        </Link>
      </div>
    </div>
  );

}
