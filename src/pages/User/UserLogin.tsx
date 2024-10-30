import { FormEvent, useState ,useEffect} from "react";
import loginImage from "/logo/userSideBeforeHome/loginImage-capsule.png";
import logo from "/logo/userSideBeforeHome/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import validator from "validator";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { setCredentials } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import { login } from "../../api/user";
import { setAdminCredentials } from "../../redux/slices/adminSlice";
import {Toaster} from 'react-hot-toast'

interface Errors {
  email?: string;
  password?: string;
}

function UserLogin (){

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { userInfo } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});


  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/user/home');
    }
  }, [userInfo]);


  const validateForm = () => {
    const newErrors: Errors = {};

    if (!email.trim() || !validator.isEmail(email)) {
      newErrors.email = "Valid email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {

    e.preventDefault();
    const isValid = validateForm();

      if (isValid) {
        const data = {
          email: email,
          password: password,
        };
        console.log(data,'from')

        const response = await login(data);

       
        if (response) {
          if (response.data.message.isAdmin) {
            localStorage.setItem('token', response.data.token);
            dispatch(setAdminCredentials(response.data.message));
            navigate('/admin/dashboard');
          }else {
            localStorage.setItem('token', response.data.token);
            dispatch(setCredentials(response.data.message));
            navigate('/user/home');
          }
        }
      }
  };


   const Glogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
        );

        console.log(res, '1');

        const data = {
          email: res.data.email,
          password: 'medilink123',
        };

        const response2 = await login(data);
        console.log(response2, '2');
        
        if (response2) {
          if (response2.data.isAdmin) {
            localStorage.setItem('token', response2.data.token);
            dispatch(setAdminCredentials(response2.data.message));
            navigate('/admin/dashboard');
          } else {
            localStorage.setItem('token', response2.data.token);
            dispatch(setCredentials(response2.data.message));
            navigate('/user/home');
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster position="top-center" />
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
  
      <form onSubmit={submitHandler} className="bg-white p-8  rounded-lg w-96 z-10">
        <h2 className="text-3xl font-semibold mb-4">User Login</h2>
  
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
  
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
          </button>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
  
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/user/verifyEmail"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
          
        </div>
  
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600"
        >
          Login
        </button>
  
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
  
        <button
          onClick={() => Glogin()}
          className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="mr-2">Log in  with Google</span>
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
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            />
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
          </svg>
        </button>
        
        <a
            href="/user/signup"
            className="text-sm text-blue-600 hover:underline"
          >
            Don't have an account? Sign Up
          </a>
      </form>
    </div>
  );
  
};

export default UserLogin;
