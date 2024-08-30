import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { adminLogout } from "../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  let dispatch = useDispatch();
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(adminLogout());
    toast.success("Logged out successfully");
    navigate("/user/login")
  };
  return (
    <header className="bg-black py-4 px-6 flex justify-between items-center fixed left-0 right-0 top-0 z-50">
      <div className="text-white font-bold text-xl flex items-center gap-3">
        {/* <span className="text-green-500 text-2xl">Paw</span>
        <FaPaw /> */}
        <img className="h-11  " src="/logo/logo-white-removebg-preview.png" alt="" />
      </div>
      <button
        className="bg-white hover:bg-gray-300 text-black font-semibold py-2 px-3 rounded-lg flex items-center"
        onClick={logout}
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
    </header>
  );
};

export default Header;