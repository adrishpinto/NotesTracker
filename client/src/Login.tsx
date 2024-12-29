import icon from "./assets/icon.svg";

import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import google from "./assets/google.svg";
import image from "./assets/container.png";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [eye, setEye] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("a@gmail.com");

  const [emailErr, setEmailErr] = useState<string>("");
  const [signUp, setSignUp] = useState<boolean>(false);
  const [otp, setOtp] = useState<number>();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [otpErr, setOtpErr] = useState<boolean>(false);

  const validateEmail = (email: string): void => {
    const invalidSymbols = /[\s!#$%^&*()+=<>?]/;
    if (email === "" || email === null) {
      setEmailErr("Please fill out email ");
      return;
    }
    if (invalidSymbols.test(email)) {
      setEmailErr("Email contains invalid symbols");
      return;
    }

    if (!email.includes("@")) {
      setEmailErr("Include `@` for a valid email");
      return;
    }

    if (
      !(
        email.includes("gmail.com") ||
        email.includes("yahoo.com") ||
        email.includes("outlook.com") ||
        email.includes("hotmail.com") ||
        email.includes("icloud.com") ||
        email.includes("aol.com") ||
        email.includes("zoho.com")
      )
    ) {
      setEmailErr("Enter valid domain ex. gmail.com");
      return;
    }

    setEmailErr("");
  };

  const URL = import.meta.env.VITE_URI;

  const verifyOtp = async () => {
    try {
      console.log("Verifying OTP:", { email, otp });
      alert("otp verified");
      const response = await axios.post(`${URL}/verify-otp`, {
        email,
        otp,
      });

      console.log("OTP verified:", response.data);
      navigate("/home");
    } catch (error) {
      alert("OTP verification failed");
      setOtpErr(true);
      console.error("Err:", error);
    }
  };

  const sendOtp = async () => {
    try {
      console.log(" OTP sent", { email });
      alert("otp sent");
      const response = await axios.post(`${URL}/send-otp`, {
        email,
      });
      setSignUp(true);
    } catch (error) {
      alert("pleaswe create an account first!");
      console.error("Err:", error);
    }
  };

  useEffect(() => {
    console.log("signUp state:", signUp);
  }, [signUp]);

  return (
    <div className="border-[1px] w-[99%] mx-auto rounded-xl border-black sm:m-1 flex justify-around h-[150vh] ">
      <div className="sm:w-[40%] w-full sm:border-r border-black">
        <div className="mt-10 sm:ml-12">
          <div className="flex w-fit mx-auto sm:mx-0">
            <img src={icon} className="size-[32px] sm:mx-0" alt="icon" />
            <h1 className="inter text-[20px] font-semibold sm:ml-2">HD</h1>
          </div>
        </div>
        <div className="sm:w-[527px] mx-auto">
          <h1 className="font-bold text-[40px] w-fit sm:w-[399px] mx-auto">
            Sign in
          </h1>
          <p className="text-[#969696] w-fit sm:w-[399px] mx-auto">
            Please login to continue to your account
          </p>

          {/* Email I/o */}
          <div className="relative w-[90%] sm:w-[399px] mx-auto mt-5 h-[70px]">
            <span className="absolute top-[-15%] left-[4%] bg-white px-1 text-sm text-[#9A9A9A]">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className="w-full px-4 py-2 border-2 h-[59px] border-[#D9D9D9] outline-none rounded-xl focus:border-blue-400 placeholder:ml-[6px]"
              placeholder="Enter your email"
            />
            {emailErr && (
              <p className="text-red-500 text-sm mt-1">{emailErr}</p>
            )}
          </div>

          {/* OTP Input */}
          <div className="relative w-[90%] sm:w-[399px] mx-auto mt-5 h-[70px]">
            <input
              type={!eye ? "password" : "text"}
              className="w-full px-4 py-2 border-2 h-[59px] border-[#D9D9D9] outline-none rounded-xl focus:border-blue-400 placeholder:ml-[6px]"
              placeholder="OTP"
              value={otp}
              onChange={(e) => {
                setOtp(Number(e.target.value));
              }}
            />
            <div
              className="absolute right-3 top-5 size-[20px] text-[20px] hover:cursor-pointer"
              onClick={() => setEye((prev) => !prev)}
            >
              {eye ? <IoEyeOutline /> : <FaRegEyeSlash />}
            </div>
            {otpErr && <p className="text-red-500 text-sm mt-1">invalid otp</p>}
          </div>

          <div className="mx-auto mt-2 sm:w-[399px] w-[90%]">
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => alert("Forgot OTP clicked!")}
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex items-center mt-4 sm:w-[399px] w-[90%] mx-auto">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-5 w-5"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm">
              Remember Me
            </label>
          </div>

          {/* Submit Buton */}
          <div
            onClick={!signUp ? sendOtp : verifyOtp}
            className="relative w-[90%] sm:w-[399px] mx-auto mt-5 h-[54px] bg-[#367AFF] rounded-xl flex items-center justify-center text-white text-[18px] font-semibold cursor-pointer hover:bg-opacity-90"
          >
            <button type="button">{signUp ? "Verify OTP" : "Sign in"}</button>
          </div>
          <div className="w-fit sm:w-[399px] mx-auto flex items-center">
            <div className="h-[1px] sm:w-[181.5px] bg-[#D9D9D9] mt-10 mb-10"></div>
            <p className="text-[16px] px-2">or</p>
            <div className="h-[1px] sm:w-[181.5px] bg-[#D9D9D9] mt-10 mb-10"></div>
          </div>
          <div className=" sm:w-[399px] w-[90%] mx-auto h-[54px]">
            <div className="border border-[#E6E8E7] rounded-xl  text-[18px] font-semibold flex h-[54px] items-center justify-center">
              <p>Sign in with Google </p>
              <img src={google} alt="" className="size-[24px]" />
            </div>
          </div>
          <div className="w-fit sm:w-[399px] mx-auto">
            <p className="text-[18px] text-[#6C6C6C] text-center mt-10 mb-10">
              Don't have an account?{" "}
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={() => navigate("/")}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-[60%] sm:block hidden">
        <img
          src={image}
          alt="img"
          className="w-[95%] mx-auto h-full object-cover"
        />
      </div>
    </div>
  );
};

export default App;
