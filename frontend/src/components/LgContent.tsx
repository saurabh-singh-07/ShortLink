import { FiLink } from "react-icons/fi";
import { loginData } from "../data/loginData";
import type { IconType } from "react-icons";
import { BsArrowDown } from "react-icons/bs";

function LgContent() {
  return (
    <div className="md:h-screen my-10 flex flex-col items-start justify-center">
      <div className="">
        <h1 className="text-5xl font-bold">
          Turn Long Links
          <br />
          into <span className="heading-text-style">Shorter Ones</span>
        </h1>
        <p className="text-sm my-3 max-w-65">
          Simplify your links, save space, and share with ease. Fast reliable
          and always free.
        </p>
      </div>

      <div className="hidden md:flex flex-col md:flex-row items-start gap-x-5 mb-10" >
        {loginData.map((data) => {
          const Icon: IconType = data.Icon;
          return (
            <div className="flex gap-x-2 my-5" key={data.id}>
              <Icon className="size-12 text-green-400" />
              <div>
                <h3 className="text-xl font-semibold">{data.title}</h3>
                <p className="text-sm md:max-w-30">{data.decsriptions}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="my-10 text-lg font-semibold">
        <p className="border rounded-2xl px-8 py-1 flex items-center gap-x-3 -rotate-3">
          <FiLink className="text-green-300" /> https://very-long-link....
        </p>
        <p className="flex items-center my-6 bg-green-400 w-fit px-4 py-1 rounded-xl text-gray-800 font-bold rotate-3">
          <BsArrowDown /> short url
        </p>
        <p className="rounded-2xl px-8 py-1 flex items-center gap-x-3 bg-linear-120 from-green-500/80 to-green-500/70 ml-6 -rotate-3">
          <FiLink /> https://lnk.sh/abc123
        </p>
      </div>
    </div>
  );
}

export default LgContent;
