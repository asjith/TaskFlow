import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal-root");

const CreateProjectModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldError, setFieldError] = useState({ name: "" });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed === "") {
      setFieldError((prev) => ({
        ...prev,
        name: "Project name is mandatory."
      }));
      return;
    }
    setFieldError((prev) => ({ ...prev, name: "" }));
  };

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-0"
      onClick={onClose}
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
              onChange={(e) => {
                setName(e.target.value);
                setFieldError((prev) => ({ ...prev, name: "" }));
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-6 pt-2">
            <button
              type="button"
              className="cursor-pointer rounded-md bg-transparent font-semibold text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 sm:py-3 sm:px-6"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md p-2.5 text-center text-sm font-semibold text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 sm:py-3 sm:px-6"
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
