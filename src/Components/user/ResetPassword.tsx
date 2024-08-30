import { useState } from "react";
import { resetPassword } from "../../api/user";
import { useLocation, useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { IoEyeOffSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import fPasswordImage  from '/logo/userSideBeforeHome/fPassword3.png'
import logo from '/logo/userSideBeforeHome/logo.png'

interface Errors {
  password?: string;
  confirmPassword?: string;
}

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitPassword = async () => {
    const valid = validateForm();
    if (valid) {
      const response = await resetPassword({ password }, { email });
      toast.success(response?.data);
      navigate("/user/login");
    }
  };

  return (
    <div className="flex w-full min-h-screen">
       <a href="/" className="absolute top-4 left-4">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </a>
      {/* Password Reset Form Section */}
      <div className="w-full sm:w-1/2 bg-white flex flex-col justify-center items-center py-12 px-6 lg:px-8">
  <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
  <h2 className="text-lg mb-8 text-center">Please reset your password</h2>
        <div className="w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg flex flex-col gap-3">
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Please enter your password"
                className="bg-gray-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={handlePasswordVisibility}
                  className="focus:outline-none"
                >
                  {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>
              {errors && <p className="text-red-500 ">{errors.password}</p>}
            </div>
            <div className="relative">
              <input
                id="cpassword"
                name="cpassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Please confirm your password"
                className="bg-gray-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={handleConfirmPasswordVisibility}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>
              {errors && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            <button
              onClick={submitPassword}
              className="mt-7 w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-800 hover:text-white bg-customColor hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset password
            </button>
          </div>
        </div>
      </div>
  
      {/* Image Section */}
      <div className="hidden sm:flex w-full sm:w-1/2 bg-customColor justify-center items-center">
        <img className="h-auto" src={fPasswordImage} alt="Logo" />
      </div>
    </div>
  );
}

export default ResetPassword;
