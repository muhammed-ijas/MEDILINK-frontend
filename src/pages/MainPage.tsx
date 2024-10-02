import React from "react";
import { useNavigate } from "react-router-dom";
import frontpageImage from "/logo/userSideBeforeHome/frontPageImage.png";
import logo from '/logo/userSideBeforeHome/logo.png'

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleUserSignup = () => {
    navigate("user/signup");
  };

  const handleSPSignup = () => {
    navigate("sp/signup");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
      <a href="/" className="absolute top-4 left-4">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </a>
        {/* Left part */}
        <div className="flex flex-col justify-center items-center h-screen md:w-1/2 text-center p-10">
          <div className="flex flex-col justify-center h-full px-8">
            <h1 className="text-7xl font-bold text-gray-800 mb-4 text-shadow">
              MEDILINK
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              At MediLink, our mission is to streamline your healthcare
              experience by connecting patients with a comprehensive network of
              service providers. Whether you’re seeking medical care or offering
              it, MediLink is your go-to platform.
            </p>

            <button
              onClick={handleUserSignup}
              className="w-auto border border-gray-400 text-gray-800 font-semibold py-2 rounded-lg mb-4 hover:bg-gray-100 hover:text-gray-800"
            >
              Find Healthcare Services
            </button>
            <button
              onClick={handleSPSignup}
              className="w-auto border border-gray-400 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-100 hover:text-gray-800"
            >
              Join as a Service Provider
            </button>
          </div>
        </div>

        {/* Right part */}
        <div className="md:w-1/2 flex justify-center items-center bg-white">
          <img
            className="w-full h-full object-cover"
            src={frontpageImage}
            alt="Healthcare"
          />
        </div>
      </div>
    </>
  );
};

export default MainPage;
