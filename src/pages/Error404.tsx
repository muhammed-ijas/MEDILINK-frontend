import { NavLink } from "react-router-dom";
import Lottie from "lottie-react";
import error from "../assets/404.json";

const Error404 = () => {
  return (
    <>
      <div
        className="bg-cover bg-center bg-[#F2F2F2] w-full min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "url('/logo/404.png')" }}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="w-60 h-40">
            <Lottie animationData={error} loop={true} />
          </div>
          <p className="text-4xl font-semibold">Oops! Page not found</p>
          <button className="bg-[#265BFF] hover:bg-pink-600 text-white font-medium py-3 px-7 mt-5 rounded-full">
            <NavLink to="/">Go to homepage</NavLink>
          </button>
        </div>
      </div>
    </>
  );
};

export default Error404;