import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants.js";
import { clearUser } from "../utils/userSlice.js";
import Loading from "./Loading.jsx";
import Error from "./Error.jsx";
import ProjectCard from "./ProjectCard.jsx";

const ProjectList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [projectList, setProjectList] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      setError(false);
      setIsLoading(true);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token ?? ""}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, data };
      }

      setProjectList(data.projects);
    } catch (err) {
      const status =
        err && typeof err === "object" && typeof err.status === "number"
          ? err.status
          : undefined;

      if (status === 401 || status === 403) {
        localStorage.clear();
        dispatch(clearUser());
        navigate("/");
        return;
      }

      if (
        status === undefined ||
        status >= 500 ||
        (status >= 400 && status < 500 && status !== 401 && status !== 403)
      ) {
        setError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="p-4 space-y-4 sm:p-14 sm:space-y-14">
      <div className="flex justify-between ">
        <h1 className="text-3xl font-extrabold text-gray-900">Projects</h1>
        <button
          type="button"
          className="rounded-md p-2.5 text-center text-sm font-semibold text-white cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/40 sm:py-3 sm:px-6"
        >
          + New Project
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectList.map((projectDetails) => (
          <ProjectCard
            key={projectDetails.id}
            projectDetails={projectDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
