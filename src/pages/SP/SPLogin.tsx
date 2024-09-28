import { FormEvent, useState ,useEffect} from "react";
import loginImage from "/logo/userSideBeforeHome/loginImage-capsule.png";
import logo from "/logo/userSideBeforeHome/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import validator from "validator";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { setCredentials } from "../../redux/slices/spSlice";
import { RootState } from "../../redux/store";
import { login } from "../../api/SP";
import {toast,Toaster}  from "react-hot-toast"




interface Errors {
  email?: string;
  password?: string;
}

function SPLogin (){

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let { spInfo } = useSelector((state: RootState) => state.sp);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});


  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (spInfo) {
      navigate('/sp/home');
    }
  }, [spInfo]);


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
          localStorage.setItem('token',response.data.token);
          dispatch(setCredentials(response.data.message));
          navigate("/sp/home");
          toast.success("Successfully logged in");
        }
      }
  };


  


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
        <h2 className="text-3xl font-semibold mb-4"> Login</h2>
  
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
  
       
        
        <a
            href="/sp/signup"
            className="text-sm text-blue-600 hover:underline"
          >
            Don't have an account? Sign Up
          </a>
      </form>
    </div>
  );
  
};

export default SPLogin;
