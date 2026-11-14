
import light from "../assets/lightHero.png";
import dark from "../assets/Hero.png";

export function HeroIllustration() {
  return (
    <div className="relative flex items-center justify-center">

      <div className="absolute h-70 w-70 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 blur-3xl" />

      {/* Light Theme Illustration */}
      <img
        src={light}
        alt="LinkShort converting a long URL into a short, trackable link"
        className="relative z-10 w-full max-w-162.5 object-contain 
        drop-shadow-[0_20px_45px_rgba(16,185,129,0.12)]
        transition-all duration-700 ease-out
        hover:scale-[1.03]
        hover:drop-shadow-[0_25px_60px_rgba(16,185,129,0.22)]
        animate-[float_6s_ease-in-out_infinite]
        block dark:hidden"
      />

      {/* Dark Theme Illustration */}
      <img
        src={dark}
        alt="LinkShort converting a long URL into a short, trackable link"
        className="relative z-10 w-full max-w-162.5 object-contain 
        drop-shadow-[0_20px_45px_rgba(16,185,129,0.12)]
        transition-all duration-700 ease-out
        hover:scale-[1.03]
        hover:drop-shadow-[0_25px_60px_rgba(16,185,129,0.22)]
        animate-[float_6s_ease-in-out_infinite]
        hidden dark:block"
      />

    </div>
  );
}
