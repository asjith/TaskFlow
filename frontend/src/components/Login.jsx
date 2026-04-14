import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants.js";
import { getEmailError, getPasswordError } from "../utils/helperFunctions.js";
import { clearUser, setUser } from "../utils/userSlice.js";
import Loading from "./Loading.jsx";

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateToken = useCallback(async (token, signal) => {
    try {
      setIsCheckingSession(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal
      });

      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, data };
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(setUser(data.user));
      navigate("/projects");
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      const status =
        err && typeof err === "object" && typeof err.status === "number"
          ? err.status
          : undefined;

      if (status === 401) {
        localStorage.clear();
        dispatch(clearUser());
        return;
      }

      if (status !== undefined && status >= 400 && status < 500) {
        setError(
          "We couldn't verify your account right now. Please try again."
        );
        return;
      }

      if (status !== undefined && status >= 500) {
        setError("Something went wrong on the server. Please try again later.");
        return;
      }

      setError(
        "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsCheckingSession(false);
      return;
    }

    const controller = new AbortController();
    validateToken(token, controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const handleValidateEmail = () => {
    const msg = getEmailError(email);
    setFieldError((prev) => ({ ...prev, email: msg }));
  };

  const handleValidatePassword = () => {
    const msg = getPasswordError(password, isSignIn);
    setFieldError((prev) => ({ ...prev, password: msg }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const trimmed = value.trim();
    if (trimmed !== "" && getEmailError(value) === "") {
      setFieldError((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (getPasswordError(value, isSignIn) === "") {
      setFieldError((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignIn) {
      return;
    }

    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password, isSignIn);
    setFieldError({ email: emailErr, password: passwordErr });

    if (emailErr !== "" || passwordErr !== "") {
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, data };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(setUser(data.user));
      navigate("/projects");
    } catch (err) {
      const isHttpError =
        err &&
        typeof err === "object" &&
        typeof err.status === "number" &&
        err.data !== undefined;

      if (isHttpError) {
        const { status, data } = err;

        if (status >= 400 && status < 500) {
          const fields = data?.fields;
          if (fields && typeof fields === "object" && !Array.isArray(fields)) {
            setFieldError((prev) => ({
              ...prev,
              ...(fields?.email != null ? { email: String(fields.email) } : {}),
              ...(fields?.password != null
                ? { password: String(fields.password) }
                : {})
            }));
          } else {
            setError(
              typeof data?.error === "string" && data.error
                ? data.error
                : "Something went wrong"
            );
          }
        } else if (status >= 500) {
          setError(
            "Something went wrong on the server. Please try again later."
          );
        } else {
          setError("Something went wrong");
        }
      } else {
        setError(
          "Something went wrong. Please check your connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn((prev) => !prev);
    setFieldError({ email: "", password: "" });
    setFullName("");
    setEmail("");
    setPassword("");
    setError("");
    setIsLoading(false);
  };

  if (isCheckingSession) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-3 sm:p-0">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg m-4 sm:m-6 sm:gap-9 sm:p-8">
        <div>
          <p className="text-sm font-bold tracking-wide text-indigo-600">
            TASKFLOW
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            {isSignIn ? "Sign In" : "Create Account"}
          </h1>
        </div>

        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
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
            disabled={isLoading}
            className={`w-full rounded-md py-2.5 text-center text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/40 sm:py-3 ${
              isLoading
                ? "cursor-not-allowed bg-indigo-400"
                : "cursor-pointer bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="min-h-4 text-xs text-red-600">
          {error ? <p>{error}</p> : null}
        </div>

        <div>
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
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
