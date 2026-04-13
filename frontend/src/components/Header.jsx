import React from "react";
import themeLight from "../icons/themeLight.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../utils/userSlice";

const Header = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-24 items-center justify-between bg-white px-4 shadow-lg sm:px-14">
      <p className="text-base font-bold tracking-wide text-indigo-600 md:text-xl">
        TASKFLOW
      </p>

      <div className="flex items-center text-sm gap-6 ">
        {/* <button
          type="button"
          className="cursor-pointer rounded-md 
        bg-transparent text-gray-700 hover:bg-gray-100 hover:text-indigo-600
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 sm:py-3 sm:px-6 "
        >
          <img className=" h-6 w-6" src={themeLight} alt="theme"></img>
        </button> */}

        {user?.name && (
          <p className=" font-bold text-gray-700">{`Hello ${user?.name}!`}</p>
        )}

        <button
          type="button"
          className="cursor-pointer rounded-md bg-transparent font-semibold text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 sm:py-3 sm:px-6"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
