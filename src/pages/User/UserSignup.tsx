import  { FormEvent, useState } from "react";
import loginImage from "/logo/userSideBeforeHome/loginImage.png";
import logo from "/logo/userSideBeforeHome/logo.png";
import {  Link,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import validator from "validator";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { Toaster ,toast } from "react-hot-toast";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { signup } from "../../api/user";
import { setCredentials } from "../../redux/slices/authSlice";

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const UserSignup: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim() || !validator.isEmail(email)) {
      newErrors.email = "Valid email is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (phone.length < 10 || phone.length > 10) {
      newErrors.phone = "Phone number must contain 10 numbers";
    }

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

  const submitHandler = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    try {
      e.preventDefault();
      const isValid = validateForm();

      if (isValid) {
        const userData = {
          name: name,
          email: email,
          phone: phone,
          password: password,
        };
        console.log(userData,'from')

        const response = await signup(userData);

        if (response) {
          toast.success(response.data.message);
          navigate("/user/otp", {
            state: {
              email: email,
              name: name,
              password: password,
              phone: phone,
            },
          });
        }
      }
    } catch (error) {}
  };

  const Glogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
        );

        const data = {
          name: res.data.name,
          email: res.data.email,
          password: "medilink123",
          fromGoogle:true,
          };

        const response2 = await signup(data);
        if (response2) {
          
          localStorage.setItem("token", response2.data.token);
          dispatch(setCredentials(response2.data.data));
          navigate("/user/home"); 
        }
      } catch (error) {}
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster  position="top-center"/>
      <a href="/" className="absolute top-4 left-4">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </a>

      <div className="relative w-1/2 md:w-1/3 lg:w-1/5">
        <img
          className="w-full h-auto object-cover"
          src={loginImage}
          alt="Healthcare"
        />
      </div>
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 w-96 z-10 "
      >
        <h2 className="text-3xl font-semibold text-center mb-6">User Signup</h2>

        {errors.name && (
          <p className="mb-2 text-sm text-red-600 text-center">
            {errors.name}
          </p>
        )}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />

        {errors.email && (
          <p className="mb-2 text-sm text-red-600 text-center">
            {errors.email}
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />

        {errors.phone && (
          <p className="mb-2 text-sm text-red-600 text-center">
            {errors.phone}
          </p>
        )}
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
          required
        />

        {errors.password && (
          <p className="mb-2 text-sm text-red-600 text-center">
            {errors.password}
          </p>
        )}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full rounded pr-10"
            required
          />
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="mb-2 text-sm text-red-600 text-center">
            {errors.confirmPassword}
          </p>
        )}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 mb-4 w-full rounded pr-10"
            required
          />
          <button
            type="button"
            onClick={handleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showConfirmPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600 mb-4"
        >
          Signup
        </button>

        <button
          type="button"
          onClick={() => Glogin()}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 mb-4"
        >
          <span className="mr-2">Sign up with Google</span>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            width="0.98em"
            height="1em"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.567 86.449-31.568l-41.2-31.967c-11.013 7.608-25.64 12.985-45.249 12.985c-34.682 0-64.097-22.088-74.594-53.229l-1.544.131l-40.303 31.15l-.525 1.518c21.587 42.734 66.235 70.48 116.966 70.48"
            />
            <path
              fill="#fbbc05"
              d="M56.118 157.32c-2.723-8.123-4.27-16.708-4.27-25.788c0-9.08 1.547-17.666 4.27-25.788l-.07-1.741l-40.801-31.662l-1.332.644c-8.762 16.889-13.747 36.147-13.747 57.547c0 21.4 4.985 40.657 13.682 57.547l41.298-32.759"
            />
            <path
              fill="#ea4335"
              d="M130.55 50.522c24.22 0 40.617 10.52 49.962 19.297l36.428-35.189c-25.963-24.155-59.952-38.627-96.39-38.627c-50.731 0-95.379 27.746-116.966 70.48l42.463 32.759c10.371-31.14 39.886-53.229 74.503-53.229"
            />
          </svg>
        </button>

        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link
              to="/user/login"
              className="text-blue-500 hover:underline font-semibold"
            >
              Login instead
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserSignup;
