import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/user";
import validator from "validator";
import { toast } from "react-toastify";
import femailImage from '/logo/userSideBeforeHome/fEmail3.png'
import logo from '/logo/userSideBeforeHome/logo.png'

interface Errors {
  email?: string;
}

function ForgetEmail() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!email.trim() || !validator.isEmail(email)) {
      newErrors.email = "Valid email is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitEmail = async () => {
    const isValid = validateForm();
    if (isValid) {
      const response = await forgotPassword({ email });
      if (response) {
        toast.success(response.data.message);
        navigate("/user/fOtp", {
          state: { email: response.data.email },
        });
      }
    }
  };
  return (
    <div className="flex w-full min-h-screen">
       <a href="/" className="absolute top-4 left-4">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </a>
      {/* Form Section */}
      <div className="w-full sm:w-1/2 bg-white flex flex-col justify-center items-center py-12 px-6">
        <h1 className="text-2xl font-bold mb-4">Enter your email</h1>
        <h2 className="text-lg mb-8">Please enter your registered email for verification.</h2>
        <div className="w-full max-w-md bg-white py-8 px-4 shadow-xl rounded-lg">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-gray-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors && <p className="text-red-500 mt-2">{errors.email}</p>}
          <button
            onClick={submitEmail}
            className="mt-7 w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-900 hover:text-white bg-customColor hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
        </div>
      </div>
  
      {/* Image Section */}
      <div className="hidden sm:flex w-full sm:w-1/2 bg-customColor justify-center items-center">
        <img className="h-auto max-w-full rounded-xl" src={femailImage} alt="Logo" />
      </div>
    </div>
  );
  
}

export default ForgetEmail;
