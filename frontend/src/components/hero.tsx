import { FaBolt } from "react-icons/fa";
import { HeroIllustration } from "./HeroIllustration";
import { BsArrowRight, BsStars } from "react-icons/bs";
import { Link } from "react-router-dom";

function Hero() {
  
  return (
    <div className="flex mt-10 flex-col md:flex-row items-center text-center justify-center">
      <div className="md:ml-10">
        <div className="flex text-lg mx-auto items-center justify-center gap-x-3 px-2 py-1 border border-green-500 text-green-600 bg-green-500/15 w-fit rounded-xl">
          <FaBolt />
          <span className="rounded-full p-1 bg-green-500"></span> Fast{" "}
          <span className="rounded-full p-1 bg-green-500"></span> Secure{" "}
          <span className="rounded-full p-1 bg-green-500"></span> Reliable
        </div>
        <div className="max-w-95 sm:max-w-120 md:max-w-140">
          <h1 className="text-4xl sm:text-5xl my-2 font-bold">
            Shorten Your Links, <br />{" "}
            <span className="heading-text-style">Simplify</span> Your World
          </h1>
          <p className="md:text-lg py-3 font-medium">
            Turn long, messy URLs into short, clean and memorable links. Track
            your clicks, manage your links and share them anywhere with ease.
          </p>
        </div>

        <div className="mt-8 flex justify-center font-semibold ">
          <div className="flex items-center gap-x-2 mx-3">
            {" "}
            <span className="text-green-500 flex items-center">
              <BsStars /> Try it now{" "}
            </span>{" "}
            - it's free{" "}
          </div>
          <Link to={"/shorturl"}>
            <button className="flex items-center gap-x-2 px-3 py-1 text-3xl bg-green-500 text-slate-50 border-2 rounded-lg hover:scale-102 hover:bg-green-600 transition-all duration-300">
              Let's Start <BsArrowRight className="size-6" />
            </button>
          </Link>
        </div>
      </div>
      <HeroIllustration />
    </div>
  );
}

export default Hero;
