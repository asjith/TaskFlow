import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants.js";
import { clearUser } from "../utils/userSlice.js";
import Loading from "./Loading.jsx";
import Error from "./Error.jsx";

const ProjectList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [projectList, setProjectList] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  console.log(projectList);

  return (
    <div>
      <p>ProjectList ({projectList.length} projects)</p>
    </div>
  );
};

export default ProjectList;
