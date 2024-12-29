import icon from "./assets/icon.svg";
import calender from "./assets/calender.svg";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import image from "./assets/container.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import google from "./assets/google.svg";

const validMonths: string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const [eye, setEye] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [emailErr, setEmailErr] = useState<string>("");
  const [signUp, setSignUp] = useState<boolean>(false);
  const [otp, setOtp] = useState<number>();
  const [otpErr, setOtpErr] = useState(false);

  const validateDate = (date: string): void => {
    const parts = date.toLowerCase().split(" ");
    if (parts.length !== 3) {
      setDateError("Please enter date in format: dd month year");
      return;
    }

    const [day, month, year] = parts;

    if (isNaN(Number(day)) || Number(day) < 1 || Number(day) > 31) {
      setDateError("Please enter a valid day (1-31)");
      return;
    }

    if (!validMonths.includes(month.toLowerCase())) {
      setDateError("Please enter a valid month name");
      return;
    }

    if (isNaN(Number(year)) || year.length !== 4) {
      setDateError("Please enter a 4 digit year");
      return;
    }

    if (Number(year) <= 1930 || Number(year) > 2024) {
      setDateError("Please enter a valid year (1930-2024)");
      return;
    }

    setDateError("");
  };

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

  const API_URL = import.meta.env.VITE_URI;

  const handleSubmit = async () => {
    try {
      console.log("data:", { name, dob, email });

      const response = await axios.post(`${API_URL}/signup`, {
        name,
        dob,
        email,
      });

      console.log("Sign up successful:", response.data);
      alert("otp sent");
      setSignUp(true);
    } catch (error) {
      alert(
        "If entered new Email otp will be sent and alert will come, otherwise enter a different email."
      );
      console.error("Error:", error);
    }
  };

  const verifyOtp = async () => {
    try {
      console.log("Verifying OTP:", { email, otp });

      const response = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });

      console.log("OTP verified:", response.data);
      navigate("/home");
    } catch (error) {
      setOtpErr(true);
      console.error("Error during OTP verification:", error);
    }
  };

  useEffect(() => {
    console.log("signUp state:", signUp);
  }, [signUp]);

  return (
    <div className="border-[1px] rounded-xl border-black sm:m-1 flex justify-around">
      <div className="sm:w-[40%] w-full border-r border-black">
        <div className="mt-10 sm:ml-12">
          <div className="flex w-fit mx-auto sm:mx-0">
            <img src={icon} className="size-[32px] sm:mx-0" alt="icon" />
            <h1 className="inter text-[20px] font-semibold sm:ml-2">HD</h1>
          </div>
        </div>
        <div className="sm:w-[527px] mx-auto">
          <h1 className="font-bold text-[40px] w-fit sm:w-[399px] mx-auto">
            Sign up
          </h1>
          <p className="text-[#969696] w-fit sm:w-[399px] mx-auto">
            Sign in to enjoy the feature of HD
          </p>

          {/* Name Input */}
          <div className="relative w-[90%] sm:w-[399px] mx-auto mt-10 h-[70px]">
            <span className="absolute top-[-15%] left-[4%] bg-white px-1 text-sm text-[#9A9A9A]">
              Your Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border-2 h-[59px] border-[#D9D9D9] outline-none rounded-xl focus:border-blue-400 placeholder:ml-[6px]"
              placeholder="Enter your name"
            />
          </div>

          {/* DB Input */}
          <div className="relative w-[90%] sm:w-[399px] mx-auto mt-5 h-[70px]">
            <span className="absolute top-[-15%] left-[4%] bg-white px-1 text-sm text-[#9A9A9A]">
              Date of Birth
            </span>
            <div>
              <img
                className="absolute top-4 left-3 size-[24px]"
                src={calender}
                alt="calendar"
              />
              <input
                type="text"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  validateDate(e.target.value);
                }}
                placeholder="dd month year"
                className="pl-10 placeholder:pl-6 w-full px-4 py-2 border-2 h-[59px] border-[#D9D9D9] outline-none rounded-xl focus:border-blue-400 placeholder:ml-[6px]"
              />
            </div>
            {dateError && (
              <p className="text-red-500 text-sm mt-1">{dateError}</p>
            )}
          </div>

          {/* Email Input */}
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
            {otpErr && (
              <p className="text-red-500 text-sm mt-1">
                {dateError}OTP verification failed
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div
            onClick={!signUp ? handleSubmit : verifyOtp}
            className="relative w-[90%] sm:w-[399px] mx-auto mt-5 h-[54px] bg-[#367AFF] rounded-xl flex items-center justify-center text-white text-[18px] font-semibold cursor-pointer hover:bg-opacity-90"
          >
            <button type="button">{signUp ? "Verify OTP" : "Sign Up"}</button>
          </div>

          <div className="w-fit sm:w-[399px] mx-auto flex items-center">
            <div className="h-[1px] sm:w-[181.5px] bg-[#D9D9D9] mt-10 mb-10"></div>
            <p className="text-[16px] px-2">or</p>
            <div className="h-[1px] sm:w-[181.5px] bg-[#D9D9D9] mt-10 mb-10"></div>
          </div>
          <div className="w-fit sm:w-[399px] mx-auto h-[54px]">
            <div className="border border-[#E6E8E7] rounded-xl text-[18px] font-semibold flex h-[54px] items-center justify-center">
              <p>Continue with Google </p>
              <img src={google} alt="" className="size-[24px]" />
            </div>
          </div>
          <div className="w-fit sm:w-[399px] mx-auto">
            <p className="text-[18px] text-[#6C6C6C] text-center mt-10 mb-10">
              Already have an account?{" "}
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Sign in
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
