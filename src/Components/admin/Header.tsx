import { useState } from 'react';
import { FaSignOutAlt } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Importing the avatar icon
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { adminLogout } from "../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import LogoutModal from '../common/LogoutModal'; // Adjust the path based on your project structure

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State to manage the modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(adminLogout());
    toast.success("Logged out successfully");
    navigate("/user/login");
  };

  const confirmLogout = () => {
    setIsModalVisible(false); // Hide the modal
    handleLogout(); // Proceed with logout
  };

  const cancelLogout = () => {
    setIsModalVisible(false); // Hide the modal
  };

  return (
    <header className="bg-black py-4 px-6 flex justify-between items-center fixed left-0 right-0 top-0 z-50">
      <div className="text-white font-bold text-xl flex items-center gap-3">
        <FontAwesomeIcon icon={faUserCircle} className="text-white text-3xl" />
      </div>
      <button
        className="bg-white hover:bg-gray-300 text-black font-semibold py-2 px-3 rounded-lg flex items-center"
        onClick={() => setIsModalVisible(true)} // Show the modal
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isVisible={isModalVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </header>
  );
};

export default Header;