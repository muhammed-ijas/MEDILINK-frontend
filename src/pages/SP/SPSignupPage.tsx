import { useState, FormEvent } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { SPSignup } from "../../api/SP";
 import validator from "validator";
import Modal from "react-modal";
import { MdLocationOn } from "react-icons/md";
import MyMap from "../../Components/common/MapBox";
import logo from "/logo/userSideBeforeHome/logo.png";
import signupImage from "/logo/HomePage/image1.jpg"; 
import {toast ,Toaster} from 'react-hot-toast'


Modal.setAppElement("#root");

interface AddressData {
  fullAddress: string;
  area: string;
  city: string;
  state: string;
  district: string;
  postcode: string;
  longitude: number;
  latitude: number;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  district?: string;
  city?: string;
  state?: string;
  pincode?: string;
  password?: string;
  confirmPassword?: string;
}

function SPSignupPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [addressSelected, setAddressSelected] = useState<boolean>(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const navigate = useNavigate();



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
    } else if (phone.length !== 10) {
      newErrors.phone = "Phone number must contain 10 digits";
    }

    if (!district.trim()) {
      newErrors.district = "District is required";
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    if (!state.trim()) {
      newErrors.state = "State is required";
    }

    if (!pincode.trim()) {
      newErrors.pincode = "Pincode is required";
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
        const SPData = {
          email: email,
          name: name,
          phone: phone,
          password: password,
          district: district,
          area: area,
          city: city,
          state: state,
          pincode: pincode,
          longitude: longitude,
          latitude: latitude,
          isverified: false,
        };
        setAddressSelected(false);
        const response = await SPSignup(SPData);
        if (response) {
          toast.success(response.data.message);
          navigate("/sp/otp", {
            state: {
              email: email,
              name: name,
              phone: phone,
              password: password,
              district: district,
              area: area,
              city: city,
              state: state,
              pincode: pincode,
              longitude: longitude,
              latitude: latitude,
              isverified: false,
            },
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleAddressSelect = (address: AddressData) => {
    setArea(address.area);
    setCity(address.city);
    setState(address.state);
    setDistrict(address.district);
    setPincode(address.postcode);
    setLongitude(address.longitude);
    setLatitude(address.latitude);
    setIsModalOpen(false);
    setAddressSelected(true);
  };

  return (
    <div className="flex h-screen">
      {/* Left Half: Image section */}
      <Toaster   position="top-center"/>
      <div className="w-1/2 h-full">
        <img
          src={signupImage}
          alt="Signup"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Half: Form  section       here..*/}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100">
        <a href="/" className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="w-20 h-auto" />
        </a>
        <div className="bg-white p-8 rounded-lg shadow-md w-3/4">
          <h1 className="text-2xl font-bold mb-2 text-center">
            SERVICE PROVIDER PORTAL
          </h1>
          <h2 className="text-lg font-semibold mb-4 text-center">
            Please fill in your details
          </h2>


          {/*  form  */}
          <form className="space-y-2" onSubmit={submitHandler}>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors && <p className="text-red-500">{errors.name}</p>}
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors && <p className="text-red-500">{errors.email}</p>}
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile Number"
              className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors && <p className="text-red-500">{errors.phone}</p>}
            <div
              className="flex items-center text-blue-500 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <MdLocationOn className="mr-2" />
              <span>Mark Location</span>
            </div>
            {addressSelected && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mt-2">
                    <input
                      id="Area"
                      name="Area"
                      type="text"
                      value={`Area: ${area}`}
                      readOnly
                      className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={`City: ${city}`}
                      readOnly
                      className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      id="district"
                      name="district"
                      type="text"
                      value={`District: ${district}`}
                      readOnly
                      className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={`State: ${state}`}
                      readOnly
                      className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      id="postcode"
                      name="postcode"
                      type="text"
                      value={`Pincode: ${pincode}`}
                      readOnly
                      className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                {showPassword ? (
                  <IoEyeOffSharp onClick={handlePasswordVisibility} />
                ) : (
                  <IoEyeSharp onClick={handlePasswordVisibility} />
                )}
              </div>
            </div>
            {errors && <p className="text-red-500">{errors.password}</p>}
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                {showConfirmPassword ? (
                  <IoEyeOffSharp onClick={handleConfirmPasswordVisibility} />
                ) : (
                  <IoEyeSharp onClick={handleConfirmPasswordVisibility} />
                )}
              </div>
            </div>
            {errors && <p className="text-red-500">{errors.confirmPassword}</p>}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </div>
            <p className="text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <Link
                to="/sp/login"
                className="text-blue-500 hover:text-blue-700"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Modal for Map */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Select Address"
        className="w-full h-full"
      >
        <MyMap onAddressSelect={handleAddressSelect} />
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-1 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 9999,
          }}
        >
          Close Map
        </button>
      </Modal>
    </div>
  );
}

export default SPSignupPage;
