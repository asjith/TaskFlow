import React from "react";

const ProjectCard = ({ projectDetails }) => {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-700 md:text-xl">
          {projectDetails.name}
        </h2>
        <p className="text-sm text-gray-500">{projectDetails.description}</p>
        <div className="flex justify-end gap-6">
          <button
            type="button"
            className="cursor-pointer rounded-md bg-transparent font-semibold text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 sm:py-3 sm:px-6"
          >
            Edit
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md bg-transparent font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/40 sm:py-3 sm:px-6"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
