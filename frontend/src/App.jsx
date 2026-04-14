import "./App.css";
import Login from "./components/Login";
import ProjectsLayout from "./components/ProjectsLayout";
import ProjectList from "./components/ProjectList";
import Project from "./components/Project";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/store.js";
import { requireAuthLoader } from "./utils/helperFunctions.js";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/projects",
    loader: requireAuthLoader,
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

function App() {
  return (
    <div>
      <Provider store={store}>
        <RouterProvider router={appRouter} />
      </Provider>
    </div>
  );
}

export default App;
