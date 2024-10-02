import { useState } from "react";
import { changePassword } from "../../api/user";
import { Toaster,toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ChangePasswordProps {
  Id: string;
}


const ChangePassword = ({ Id }: ChangePasswordProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");
    setOldPasswordError("");
  
    let hasError = false;
  
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      hasError = true;
    }
  
    if (oldPassword.length < 6) {
      setOldPasswordError("Password must be at least 6 characters long");
      hasError = true;
    }
  
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }
  
    if (hasError) {
      return;
    }
  
    try {
      const response = await changePassword(Id, password, oldPassword);
      console.log("response: from component :", response);
      if (response.status==200) {
        toast.success("Password changed successfully", { position: "top-center" });
        setPassword("");
        setConfirmPassword("");
        setOldPassword("");
      }
      if(response.status==201){
        toast.error(response.message)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to change password", { position: "top-center" });
    }
  };
  

  return (
    <div className="bg-white h-[500px] w-full p-6">
      <Toaster position="top-center" />
      <div className="flex flex-col items-center">
        <form className="w-full max-w-md mt-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label
                htmlFor="oldPassword"
                className="block mb-2 text-black text-sm md:text-base font-medium"
              >
                Old Password:
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-7 flex items-center"
                onClick={() => setShowOldPassword((prev) => !prev)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {oldPasswordError && (
                <p className="text-red-500 text-xs mt-1">{oldPasswordError}</p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-2 text-black text-sm md:text-base font-medium"
              >
                New Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-7 flex items-center"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-black text-sm md:text-base font-medium"
              >
                Confirm New Password:
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-8 flex items-center"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {confirmPasswordError && (
                <p className="text-red-500 text-xs mt-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
