import { BiMinus } from "react-icons/bi";
import { heroData } from "../data/heroData";

function HeroDetails() {
  return (
    <div className="flex flex-col items-center text-center my-10">
      <div>
        <h3 className="flex justify-center items-center font-normal text-green-600/90">
          {" "}
          <BiMinus /> WHY CHOOSE LINKSHORT
        </h3>
        <p className="text-3xl font-bold my-2">Everything You Need</p>
        <p className="text-slate-600 dark:text-slate-300">
          Powerful features to make you link management simple and effective.
        </p>
      </div>
      <div className="flex justify-center flex-wrap gap-8 my-12">
        {heroData.map((data) => {
          const Icon = data.Icon;
          return (
            <div className="flex  flex-col items-center item" key={data.id}>
              <div>
                <Icon className="size-15 p-3 bg-green-500/30 rounded-full"/>
              </div>
              <h4 className="font-semibold text-slate-800 text-lg dark:text-slate-100">{data.name}</h4>
              <p className="text-slate-600 dark:text-slate-200  max-w-45 lg:max-w-60">{data.descriptions}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HeroDetails;
