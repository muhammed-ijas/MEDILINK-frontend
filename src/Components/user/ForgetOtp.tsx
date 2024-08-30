import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fOtpVerify, resendOTP } from "../../api/user";
import { toast } from "react-toastify";
import errorHandle from "../../api/error"; // Adjust the path accordingly
import femailImage from '/logo/userSideBeforeHome/fOtp4.png'
import logo from '/logo/userSideBeforeHome/logo.png'

function ForgetOtp() {
  const [otp, setOtp] = useState("");
  const [resendButton, setShowResendButton] = useState(true);
  const [timerValue, setTimerValue] = useState(60);
  const navigate = useNavigate();

  const location = useLocation();
  const data = location.state;

  const submitOtp = async () => {
    try {
      let response = await fOtpVerify(
        { otp: parseInt(otp) },
        { email: data.email }
      );

      if (response) {
        toast.success(response.data);
        navigate("/user/resetPassword", {
          state: { email: data.email },
        });
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
      const response: any = await resendOTP(data.email);
      if (response) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      errorHandle(error);
    }
  };
  return (
    <div className="flex w-full min-h-screen">
       <a href="/" className="absolute top-4 left-4">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </a>
      {/* Image Section */}
      <div className="hidden sm:flex w-full sm:w-1/2 bg-customColor justify-center items-center">
        <img className="h-auto" src={femailImage} alt="Logo" />
      </div>
  
      <div className="w-full sm:w-1/2 bg-white flex flex-col justify-center  items-center py-12 px-6">
        <h1 className="text-2xl font-bold mb-4">Enter your OTP</h1>
        <h2 className="text-lg mb-8">
          A 4 digit OTP has been sent to your registered email.
        </h2>
        <div className="w-full max-w-md bg-white py-8 px-4 shadow-xl rounded-lg">
          <input
            id="otp"
            name="otp"
            type="number"
            placeholder="Enter your OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
            className="bg-gray-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            onClick={submitOtp}
            className="mt-7 w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-800 hover:text-white bg-customColor hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
          <div className="mt-3 text-sm flex gap-1">
            <p>Didn't receive OTP?</p>
            {resendButton ? (
              <button className="text-blue-800" onClick={handleResendOtp}>
                RESEND OTP
              </button>
            ) : (
              <span className="text-blue-800">
                Resend OTP in {timerValue}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetOtp;
