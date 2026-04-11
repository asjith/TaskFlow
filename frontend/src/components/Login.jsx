import React, { useState } from "react";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg flex flex-col gap-6 m-6">
        <div>
          <p className="text-sm font-bold tracking-wide text-indigo-600">
            TASKFLOW
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            {isSignIn ? "Sign In" : "Create Account"}
          </h1>
        </div>

        <form className="space-y-4">
          {!isSignIn && (
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-3 text-center text-sm font-semibold text-white cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="min-h-6" />

        <div>
          <button
            type="button"
            className="rounded-sm text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setIsSignIn(!isSignIn)}
          >
            {isSignIn ? (
              <p>
                Don't have an account?{" "}
                <span className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Register
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Sign In
                </span>
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
