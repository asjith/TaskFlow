import "./App.css";
import Login from "./components/Login";
import ProjectsLayout from "./components/ProjectsLayout";
import ProjectList from "./components/ProjectList";
import Project from "./components/Project";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/projects",
      element: <ProjectsLayout />,
      children: [
        {
          index: true,
          element: <ProjectList />
        },
        {
          path: ":id",
          element: <Project />
        }
      ]
    }
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
