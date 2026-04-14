import { redirect } from "react-router-dom";
import { EMAIL_REGEX } from "./constants.js";

export function requireAuthLoader() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (!token || !user) {
    throw redirect("/");
  }
  return null;
}

export function getEmailError(email) {
  const trimmed = email.trim();
  if (trimmed === "") return "Email is required";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address";
  return "";
}

export function getPasswordError(password, isSignIn) {
  if (password.length === 0) return "Password is required";
  if (!isSignIn && password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return "";
}
