import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants.js";
import { clearUser } from "../utils/userSlice.js";

const modalRoot = document.getElementById("modal-root");

const logoutAndNavigateHome = (dispatch, navigate) => {
  localStorage.clear();
  dispatch(clearUser());
  navigate("/");
};

const CreateProjectModal = ({ onClose, getProjectList }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const abortRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDismiss = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    onClose();
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (trimmed === "") {
      setFieldError((prev) => ({
        ...prev,
        name: "Project name is mandatory."
      }));
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      logoutAndNavigateHome(dispatch, navigate);
      return;
    }

    try {
      setFieldError((prev) => ({ ...prev, name: "" }));
      setError("");
      setIsLoading(true);
      abortRef.current = new AbortController();
      const { signal } = abortRef.current;

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: trimmed,
          description
        }),
        signal
      });

      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, data };
      }
      getProjectList();
      handleDismiss();
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      const isHttpError =
        err &&
        typeof err === "object" &&
        typeof err.status === "number" &&
        err.data !== undefined;

      if (isHttpError) {
        const { status, data } = err;

        if (status === 401 || status === 403) {
          logoutAndNavigateHome(dispatch, navigate);
          return;
        }

        if (status === 400) {
          const fields = data?.fields;
          if (fields && typeof fields === "object" && !Array.isArray(fields)) {
            setFieldError((prev) => ({
              ...prev,
              ...(fields?.name != null ? { name: String(fields.name) } : {})
            }));
            return;
          }
          setError(
            typeof data?.error === "string" && data.error
              ? data.error
              : "Something went wrong"
          );
          return;
        }

        if (status >= 500) {
          setError(
            "Something went wrong on the server. Please try again later."
          );
          return;
        }

        if (status >= 400 && status < 500) {
          setError(
            "We couldn't complete this request right now. Please try again."
          );
          return;
        }

        setError("Something went wrong");
      } else {
        setError(
          "Something went wrong. Please check your connection and try again."
        );
      }
    } finally {
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-0"
      onClick={handleDismiss}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-md border border-gray-200 bg-white p-6 shadow-lg sm:p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
      >
        <h2
          id="create-project-title"
          className="text-3xl font-extrabold text-gray-900"
        >
          Create a Project
        </h2>

        <form
          className="mt-6 space-y-3 sm:mt-9 sm:space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <label
              htmlFor="projectName"
              className="block text-sm font-semibold text-gray-700"
            >
              Project Name <span className="text-red-600">*</span>
            </label>
            <input
              id="projectName"
              name="projectName"
              type="text"
              placeholder="Enter project name"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              value={name}
              disabled={isLoading}
              onChange={(e) => {
                setName(e.target.value);
                setFieldError((prev) => ({ ...prev, name: "" }));
                setError("");
              }}
            />
            <div className="min-h-4">
              {fieldError.name ? (
                <p className="text-xs text-red-600">{fieldError.name}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="projectDescription"
              className="block text-sm font-semibold text-gray-700"
            >
              Description
            </label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              placeholder="Enter project description"
              rows={3}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              value={description}
              disabled={isLoading}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div aria-live="polite" className="min-h-4">
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
          </div>

          <div className="flex justify-end gap-6 pt-2">
            <button
              type="button"
              className="cursor-pointer rounded-md bg-transparent font-semibold text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 sm:py-3 sm:px-6"
              onClick={handleDismiss}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md p-2.5 text-center text-sm font-semibold text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 sm:py-3 sm:px-6"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>,
    modalRoot
  );
};

export default CreateProjectModal;
