import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import { clearUser, setUser } from "../utils/userSlice.js";

const ProjectsLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user != null) {
      return;
    }

    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    const hasToken = Boolean(token);
    const hasUser = rawUser != null && rawUser !== "";

    if (!hasToken && !hasUser) {
      navigate("/");
      return;
    }

    if (!hasToken || !hasUser) {
      localStorage.clear();
      dispatch(clearUser());
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      dispatch(setUser(parsed));
    } catch {
      localStorage.clear();
      dispatch(clearUser());
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <Header />
      <div className="pt-24">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectsLayout;
