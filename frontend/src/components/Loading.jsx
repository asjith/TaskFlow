import React from "react";
import loading from "../icons/loading.png";

const Loading = () => {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center">
      <img src={loading} alt="Loading" className="max-w-xs animate-spin" />
    </div>
  );
};

export default Loading;
