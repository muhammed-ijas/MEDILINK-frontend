import  { useState, useEffect } from 'react';
import blockedImage from "/logo/HomePage/9696387-removebg-preview.png";
import LoadingSpinner from "../Components/common/LoadingSpinner"; // Assuming the spinner is in the components folder

const BlockedByAdmin = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const image = new Image();
    image.src = blockedImage;
    image.onload = () => {
      setLoading(false); // Set loading to false when image is loaded
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {loading ? (
        <LoadingSpinner /> // Show the spinner while loading
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6">
            It seems you have been blocked by the admin. Please contact  for assistance.
          </p>
          <div className="flex justify-center mb-6">
            <img src={blockedImage} alt="Blocked" className="w-40 h-40 object-contain"/>
          </div>
          {/* <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
            Contact Support
          </button> */}
        </div>
      )}
    </div>
  );
};

export default BlockedByAdmin;
