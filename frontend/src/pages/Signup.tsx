import { useState } from "react";
import { Link } from "react-router-dom";
import { type RegFormTypes } from "../types/FormTypes";
import { BsEye } from "react-icons/bs";
import { FaEyeSlash } from "react-icons/fa";
import BgStyle from "../components/BgStyle";
import { FiLink } from "react-icons/fi";
import LgContent from "../components/LgContent";
import api from "../api/api";
import { GrGoogle } from "react-icons/gr";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

function Signup() {
  const {setAuth} = useAuth();
  const [formData, setFormData] = useState<RegFormTypes>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/register", formData);
      setAuth(response.data?.accessToken, response.data?.user);
      toast.success("registration successfull...")
      console.log(response);
    } catch (error) {
      console.error("error : ",error);
      toast.error("something wrong, please try again later...");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };
  return (
    <section>
      <BgStyle />
      <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-around">
        <LgContent />
        <div className="min-w-90 mb-5 dark:bg-[#0b1816e3] border border-green-500 rounded-lg shadow-[#101118] shadow-2xl px-5 py-10">
          <div className=" mx-5 my-6 pb-1 border-b ">
            <h1 className="text-2xl mb-8 font-bold flex">
              <FiLink className="text-green-500 size-7 mr-1" /> Link
              <span className="heading-text-style">Short</span>
            </h1>
            <h2 className="text-xl font-bold">Welcome..</h2>
            <p className="text-[14px]">
              Register to your account and start shortening link today.
            </p>
          </div>

          {/* Registration form  */}
          <form onSubmit={handleSubmit} className="px-5 text-[14px]">
            <label htmlFor="name">Name *</label> <br />
            <input
              type="text"
              name="name"
              className="border px-2 py-1 mb-4 rounded-lg w-full"
              required
              onChange={handleChange}
              placeholder="Enter your name..."
            />
            <br />
            <label htmlFor="email">Email *</label>
            <br />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter your email..."
              className="border px-2 py-1 mb-4 rounded-lg w-full"
              required
            />
            <br />
            <label htmlFor="password">password *</label>
            <br />
            <div className="flex relative items-center border px-2 py-1 rounded-lg w-full focus-within:border-white focus:outline-2 focus-within:border-2">
              <input
                className="w-full outline-none"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your Password..."
                required
                onChange={handleChange}
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
              Create an Account
            </button>
            <button onClick={handleGoogleLogin} className="flex justify-center items-center gap-x-4 w-full mt-5 px-4 py-1 font-semibold text-lg hover:scale-98 dark:text-slate-600/70 bg-green-100 shadow shadow-gray-500 hover:shadow transition-all duration-300 rounded-lg">
              <GrGoogle className="text-orange-500" /> Login With Google
            </button>
            <p className="mt-5">
              ALready have an accout ?{" "}
              <Link
                className="hover:text-orange-600 transition-colors duration-300"
                to={"/login"}
              >
                Login In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Signup;
