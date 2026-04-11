import React, { useState } from "react";
import { EMAIL_REGEX } from "../utils/constants.js";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState({
    email: "",
    password: ""
  });

  const handleValidateEmail = () => {
    const trimmed = email.trim();
    if (trimmed === "") {
      setFieldError((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setFieldError((prev) => ({
        ...prev,
        email: "Enter a valid email address"
      }));
      return;
    }
    setFieldError((prev) => ({ ...prev, email: "" }));
  };

  const handleValidatePassword = () => {
    if (password.length === 0) {
      setFieldError((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }
    if (!isSignIn && password.length < 8) {
      setFieldError((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters"
      }));
      return;
    }
    setFieldError((prev) => ({ ...prev, password: "" }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const trimmed = value.trim();
    if (trimmed !== "" && EMAIL_REGEX.test(trimmed)) {
      setFieldError((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (isSignIn) {
      if (value.length > 0) {
        setFieldError((prev) => ({ ...prev, password: "" }));
      }
    } else if (value.length >= 8) {
      setFieldError((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const toggleAuthMode = () => {
    setIsSignIn((prev) => !prev);
    setFieldError({ email: "", password: "" });
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg flex flex-col gap-9 m-6">
        <div>
          <p className="text-sm font-bold tracking-wide text-indigo-600">
            TASKFLOW
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            {isSignIn ? "Sign In" : "Create Account"}
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className="min-h-4"></div>
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
              value={email}
              onChange={handleEmailChange}
              onBlur={handleValidateEmail}
            />
            <div className="min-h-4">
              {fieldError.email ? (
                <p className="text-xs text-red-600">{fieldError.email}</p>
              ) : null}
            </div>
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
              value={password}
              onChange={handlePasswordChange}
              onBlur={handleValidatePassword}
            />
            <div className="min-h-4">
              {fieldError.password ? (
                <p className="text-xs text-red-600">{fieldError.password}</p>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-3 text-center text-sm font-semibold text-white cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="min-h-4 text-xs text-red-600" />

        <div>
          <button
            type="button"
            className="rounded-sm text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={toggleAuthMode}
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
