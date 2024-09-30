import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { spLogout } from "../../redux/slices/spSlice";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";
import { SlCalender, SlEnvolope } from "react-icons/sl";
import { FaPowerOff } from "react-icons/fa6";
// import { toast } from "react-toastify";
import { toast } from "react-hot-toast";
import { RootState } from "../../redux/store";
import { useBoolean } from "@chakra-ui/react";
import logo from "/logo/userSideBeforeHome/logo.png";
import LogoutModal from "../../Components/common/LogoutModal";
import EmergencyModal from "./EmergencyModal";

function Header() {
  let { spInfo } = useSelector((state: RootState) => state.sp);
  const [isDropdownOpen, setIsDropdownOpen] = useBoolean();
  const [isHamburger, setIsHamburger] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  let navigate = useNavigate();
  let dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    setIsHamburger(false);
    setIsDropdownOpen.off();
  }, [location]);

  const toggleEmergencyModal = () =>
    setIsEmergencyModalOpen(!isEmergencyModalOpen);

  const activeStyle = {
    color: "#000000", // Black color
    fontWeight: "bold",
    textDecoration: "none",
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(true); // Show the modal
  };

  const confirmLogout = async () => {
    setIsDropdownOpen.off();
    setIsHamburger(false);
    localStorage.removeItem("token");
    dispatch(spLogout());
    navigate("/sp/home");
    toast.success("Logged out successfully", { position: "top-center" });
    setIsLogoutModalVisible(false); // Hide the modal after logout
  };

  const cancelLogout = () => {
    setIsLogoutModalVisible(false); // Hide the modal when canceled
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md border border-gray-200  lg:px-8 py-4 relative">
      {/* <Toaster position="top-center" /> */}
      <div className="flex items-center justify-between px-4 lg:px-8 w-full">
        {/* Logo */}
        <a href="/sp/home" className="flex items-center">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
        </a>

        {spInfo && (
          <button
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            onClick={toggleEmergencyModal}
          >
            Emergency Services
          </button>
        )}

        {/* Navigation Links (Centered) */}
        <div className="hidden lg:flex flex-grow justify-center space-x-6">
          <NavLink
            to="/sp/home"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Home
          </NavLink>
          <NavLink
            to="/sp/services"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Services
          </NavLink>
          <NavLink
            to="/sp/about"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            About
          </NavLink>
          <NavLink
            to="/sp/contact"
            className="text-sm text-gray-800 hover:text-gray-600 transition-colors duration-200"
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
          >
            Contact
          </NavLink>
        </div>

        {/* User Profile Dropdown (Right) */}
        <div className="relative flex-shrink-0">
          <button
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-gray-800 uppercase rounded-lg hover:bg-gray-100"
            type="button"
            onClick={() => {
              if (spInfo) {
                setIsDropdownOpen.toggle();
              } else {
                navigate("/sp/login");
              }
            }}
          >
            {spInfo ? (
              <>
                <span>{spInfo.name}</span>
                <FaCaretDown />
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 py-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              onMouseLeave={() => setIsDropdownOpen.off()}
            >
              <NavLink
                to="/sp/profile"
                className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex gap-2 items-center"
              >
                <FaUserCircle />
                Profile
              </NavLink>
              <NavLink
                to="/sp/messages"
                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <SlEnvolope />
                Messages
              </NavLink>
              <NavLink
                to="/sp/bookings"
                className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <SlCalender />
                My bookings
              </NavLink>

              <button
                className="flex gap-2 items-center w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                onClick={handleLogout}
              >
                <FaPowerOff />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="lg:hidden flex items-center"
          type="button"
          onClick={() => setIsHamburger(!isHamburger)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Hamburger Dropdown */}
        {isHamburger && (
          <div className="absolute top-16 right-4 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <NavLink
              to="/sp/home"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsHamburger(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/sp/services"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsHamburger(false)}
            >
              Services
            </NavLink>
            <NavLink
              to="/sp/contact"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => setIsHamburger(false)}
            >
              Contact
            </NavLink>
            {spInfo && (
              <>
                <NavLink
                  to="/sp/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsHamburger(false)}
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/sp/bookings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsHamburger(false)}
                >
                  My bookings
                </NavLink>
                <button
                  className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
     {
  spInfo ? (
    <EmergencyModal
      isOpen={isEmergencyModalOpen}
      onClose={toggleEmergencyModal}
      spId={spInfo._id}
    />
  ) : null // or <></> for an empty fragment
}

     
    </nav>
  );
}

export default Header;
