import { Link } from "react-router-dom";
import {
  BiArrowBack,
  BiHomeAlt,
  BiLink,
  BiSearchAlt,
} from "react-icons/bi";
import BgStyle from "../components/BgStyle";

const PageNotFound = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-900 transition-colors duration-300 dark:bg-[#080b09] dark:text-white">
      {/* Background */}
      <BgStyle />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between border-b border-gray-200/70 px-5 py-5 dark:border-white/10 sm:px-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <BiLink size={23} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Link<span className="text-emerald-600">Short</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium transition hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10 dark:hover:border-emerald-500"
          >
            <BiHomeAlt size={18} />
            Home
          </Link>
        </header>

        {/* Main content */}
        <main className="flex flex-1 items-center justify-center px-5 py-16">
          <div className="mx-auto w-full max-w-2xl text-center">
            {/* 404 illustration */}
            <div className="relative mx-auto mb-8 flex h-44 w-64 items-center justify-center sm:h-56 sm:w-80">
              <div className="absolute h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl sm:h-48 sm:w-48" />

              <span className="relative select-none text-[110px] font-black leading-none tracking-tighter text-emerald-600/15 sm:text-[150px]">
                404
              </span>

              <div className="absolute flex h-16 w-16 -rotate-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-xl shadow-emerald-500/10 backdrop-blur-sm sm:h-20 sm:w-20">
                <BiSearchAlt className="text-emerald-600" size={42} />
              </div>

              <span className="absolute right-8 top-8 h-3 w-3 rounded-full bg-emerald-500 sm:right-12 sm:top-10" />
              <span className="absolute bottom-5 left-8 h-2 w-2 rounded-full bg-emerald-400 sm:left-12" />
            </div>

            {/* Message */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Error 404 · Page not found
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Oops! Lost your way?
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
              Looks like this link has gone missing. The page you're looking
              for may have been moved, deleted, or never existed.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                <BiHomeAlt size={20} />
                Back to Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-6 py-3 font-semibold transition hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-500"
              >
                <BiArrowBack size={20} />
                Go Back
              </button>
            </div>

            {/* Footer hint */}
            <div className="mt-12 border-t border-gray-200/70 pt-6 dark:border-white/10">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Need a fresh start?{" "}
                <Link
                  to="/"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Create a short link
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-5 py-5 text-center text-xs text-gray-500 dark:text-gray-600">
          © {new Date().getFullYear()} LinkShort. Made for simpler links.
        </footer>
      </div>
    </div>
  );
};

export default PageNotFound;