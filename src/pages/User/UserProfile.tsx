import { useState, useEffect } from "react";
import { FaUserCircle, FaLock } from "react-icons/fa";
import Profile from "../../Components/user/Profile";
import ChangePassword from "../../Components/user/ChangePasswordProfile";
import UserWallet from "../../Components/user/UserWallet";
import { getProfile } from "../../api/user";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import "./UserProfile.css";

interface ProfileState {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [state, setState] = useState(false);
  const [profile, setProfile] = useState<ProfileState>({
    _id: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setLoadingProfile(true);
    getProfile(userInfo._id)
      .then((response) => {
        setProfile(response?.data);
      })
      .finally(() => {
        setLoadingProfile(false);
      });
    setState(false);
  }, [state, userInfo._id]);

  const handle = (data: boolean) => {
    setState(data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <div className="w-full max-w-screen-xl   rounded-lg overflow-hidden mx-auto mt-8">
        <div className="p-4 md:p-8 text-white">
          <div className="flex justify-center mb-4 gap-4">
            {/* profilebutton */}
            <button
              className={`flex items-center gap-3 p-4 rounded-full text-black bg-white border  text-base transition-all duration-300 hover:bg-white hover:text-black hover:shadow-md ${
                activeTab === "profile" ? " shadow-lg" : ""
              }`}
              onClick={() => handleTabChange("profile")}
            >
              <FaUserCircle className="text-lg" />
              <span className="font-semibold text-sm md:text-base capitalize">
                Profile
              </span>
            </button>

            {/* change password button */}
            <button
              className={`flex items-center gap-3 p-4 rounded-full text-base text-black bg-white border transition-all duration-300 hover:bg-white hover:text-black hover:shadow-md ${
                activeTab === "changePassword" ? " shadow-lg" : ""
              }`}
              onClick={() => handleTabChange("changePassword")}
            >
              <FaLock className="text-md" />
              <span className="font-semibold text-sm md:text-base capitalize ">
                Change Password
              </span>
            </button>

            {/* wallet button */}
            <button
              className={`flex items-center gap-3 p-4 rounded-full text-base text-black bg-white border transition-all duration-300 hover:bg-white hover:text-black hover:shadow-md ${
                activeTab === "wallet" ? " shadow-lg" : ""
              }`}
              onClick={() => handleTabChange("wallet")}
            >
              <FaLock className="text-md" />
              <span className="font-semibold text-sm md:text-base capitalize ">
                Wallet
              </span>
            </button>
          </div>
        </div>
        <div className="p-6">
          {loadingProfile ? (
            <div className="text-center text-gray-400 text-sm md:text-lg">
              <div className="loader"></div>
              Loading Profile...
            </div>
          ) : activeTab === "profile" ? (
            <Profile profile={profile} state={handle} />
          ) : activeTab === "changePassword" ? (
            <ChangePassword Id={userInfo._id} />
          ) : activeTab === "wallet" ? (
            <UserWallet Id={userInfo._id} />
          ) : null}{" "}
          {/* Added colon here */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
