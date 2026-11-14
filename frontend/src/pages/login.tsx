import { useState } from "react";
import { BsEye } from "react-icons/bs";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LoginFromTypes } from "../types/FormTypes";
import { FiLink } from "react-icons/fi";
import BgStyle from "../components/BgStyle";
import LgContent from "../components/LgContent";
import { GrGoogle } from "react-icons/gr";
import api from "../api/api";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

function login() {
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState<LoginFromTypes>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", formData);
      console.log(response);
      setAuth(response.data?.accessToken, response.data?.user);
      toast.success("Login successfull...");
      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      console.error('error :',error)
      toast.error("somthing wrong, please try again...");
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_LOGIN_URL;
  };
  return (
    <section>
      <BgStyle />
      {/* Your login page content */}
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row justify-around items-center">
        <LgContent />
        <div className="min-w-90 mb-10 dark:bg-[#0b1816e3] border border-green-500 rounded-lg shadow-[#101118] shadow-2xl px-5 py-10 ">
          <div className=" mx-5 my-10 pb-1 border-b ">
            <h1 className="text-2xl mb-8 font-bold flex">
              <FiLink className="text-green-500 size-7 mr-1" /> Link
              <span className="heading-text-style">Short</span>
            </h1>
            <h2 className="text-xl font-bold">Welcome Back</h2>
            <p className="text-[14px]">
              Login to your account and start shortening link today.
            </p>
          </div>

          <form className="px-5 py-2 text-[14px]" onSubmit={handleSubmit}>
            <label htmlFor="email">Email *</label>
            <br />
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              className="border px-2 py-1 mb-5 rounded-lg w-full"
              required
            />
            <br />
            <label htmlFor="password">password *</label>
            <br />
            <div className="flex relative items-center border px-2 py-1 rounded-lg w-full focus-within:border-white focus:outline-2 focus-within:border-2">
              <div className="absolute right-2 -top-7 hover:text-green-500 hover:border-b transition-all duration-300">
                <Link to={"#"}>Forget Password ?</Link>
              </div>
              <input
                onChange={handleChange}
                className="w-full outline-none"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your Password..."
                required
              />
              <span
                className="absolute right-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BsEye /> : <FaEyeSlash />}
              </span>
            </div>
            <br />
            <button
              type="submit"
              className="w-full mt-5 px-4 py-1 font-semibold text-lg hover:scale-98 bg-linear-to-b from-green-500 to-green-700 hover:shadow shadow-green-800 transition-all duration-300 rounded-lg"
            >
              Login
            </button>
            <button
              onClick={handleGoogleLogin}
              className="flex justify-center items-center gap-x-4 w-full mt-5 px-4 py-1 font-semibold text-lg hover:scale-98 dark:text-slate-600/70 bg-green-100 shadow shadow-gray-500 hover:shadow transition-all duration-300 rounded-lg"
            >
              <GrGoogle className="text-orange-500" /> Login With Google
            </button>

            <p className="mt-5">
              Don't have an account ?{"  "}
              <Link
                className="hover:text-green-500 transition-colors duration-300 border-b"
                to={"/signup"}
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default login;
