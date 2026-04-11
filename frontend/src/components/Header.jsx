import React from "react";
import themeLight from "../icons/themeLight.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-24 items-center justify-between bg-white px-14 shadow-md">
      <p className="text-base font-bold tracking-wide text-indigo-600 md:text-xl">
        TASKFLOW
      </p>

      <div className="flex items-center gap-4 text-base md:gap-6 ">
        <button
          type="button"
          className="cursor-pointer rounded-md py-3 px-6 
        bg-transparent text-gray-700 hover:bg-gray-100 hover:text-indigo-600
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40"
        >
          <img className=" h-6 w-6" src={themeLight}></img>
        </button>

        <p className=" font-bold text-gray-700">Hello User!</p>

        <button
          type="button"
          className="cursor-pointer rounded-md bg-transparent py-3 px-6 font-semibold text-gray-700 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
