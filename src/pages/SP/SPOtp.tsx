import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/spSlice";
import { otpVerify, resentOTP } from "../../api/SP";
import { Toaster, toast } from "react-hot-toast";
import errorHandle from "../../api/error"; 
import OtpPage from '/logo/userSideBeforeHome/otpPageImage.png'
import logo from '/logo/userSideBeforeHome/logo.png'



function Otp() {
  const [otp, setOtp] = useState("");
  const [resendButton, setShowResendButton] = useState(true);
  const [timerValue, setTimerValue] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const data = location.state;

  const submitOtp = async () => {
    try {
      let response = await otpVerify(
        { otp: parseInt(otp) },
        { email: data.email }
      );
      if (response) {
        console.log("came here ,the response back to otp page");
        toast.success(response.data.message);
        localStorage.setItem("token", response?.data.token);
        dispatch(setCredentials(response?.data.data));
        navigate("/sp/login");
      }
    } catch (error: any) {
      errorHandle(error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!resendButton && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue((prevValue) => prevValue - 1);
      }, 1000);
    } else if (timerValue === 0) {
      setShowResendButton(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendButton, timerValue]);

  const handleResendOtp = async () => {
    setShowResendButton(false);
    setTimerValue(60);
    try {
      const response: any = await resentOTP(
        data.email,
        data.name,
        data.password,
        data.phone,
        data.area,
        data.city,
        data.latitude,
        data.longitude,
        data.state,
        data.pincode,
        data.district
      );
      if (response) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      errorHandle(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <Toaster position="top-center" />
      <a href="/" className="absolute top-4 left-4">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </a>
      {/* Left Section */}
      <div className="hidden md:flex w-2/5 bg-white">
    <div
      className="h-full bg-customColor flex justify-center items-center"
      style={{}}
    >
      <img
        className="max-h-full max-w-full object-contain"
        src={OtpPage}
        alt="Logo"
      />
    </div>
  </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-3/5 px-6 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 sm:p-10 w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">Enter your OTP</h1>
          <p className="text-center text-gray-600 mb-8">
            A 4-digit OTP has been sent to your registered email.
          </p>

          <input
            id="otp"
            name="otp"
            type="number"
            placeholder="Enter your OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
            className="bg-gray-100 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-6"
          />

          <button
            onClick={submitOtp}
            className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-800 bg-customColor hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>

          <div className="mt-4 text-sm text-center">
            <p className="mb-2">Didn't receive OTP?</p>
            {resendButton ? (
              <button className="text-blue-800" onClick={handleResendOtp}>
                RESEND OTP
              </button>
            ) : (
              <span className="text-blue-800">Resend OTP in {timerValue}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
