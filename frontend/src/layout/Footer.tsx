
import FooterBg from "../components/FooterBg";

function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-emerald-500/15 bg-[#03110d] text-white">

      <FooterBg />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        {/* Add your logo, links, social icons and copyright here */}
        <h2 className="text-2xl font-bold">
          Short<span className="text-emerald-400">Link</span>
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
          Shorten links, track performance, and share them anywhere.
        </p>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} LinkShort. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
