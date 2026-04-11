import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const ProjectsLayout = () => {
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
