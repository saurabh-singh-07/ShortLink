
function BgStyle() {
  return (
    <>
      <div className="pointer-events-none absolute -top-64 -left-40 h-150px w-187.5 rounded-full bg-emerald-500/25 blur-[100px]"/>
      {/* Bottom green glow */}
    <div className="pointer-events-none absolute top-40 -right-80 h-105 w-145 rotate-[-8deg] rounded-[50%] border-b border-emerald-400/20 bg-linear-to-b from-transparent via-emerald-600/10 to-emerald-400/20"/>
      <div className="pointer-events-none absolute -bottom-80 -left-40 h-137.5 w-250 rounded-full bg-green-500/50 blur-[100px]"/>
      {/* Green curved shapes */}
      <div className="pointer-events-none absolute -bottom-80 -left-60 h-125 w-275 rotate-[-8deg] rounded-[50%] border-t border-emerald-400/20 bg-linear-to-b from-emerald-500/20 via-emerald-700/10 to-transparent"/>
      {/* Subtle upper-right glow */}
      <div className="pointer-events-none absolute -right-40 -top-60 h-137.5 w-162.5 rounded-full dark:bg-green-900/20 bg-green-500/30 blur-[120px]"/>
      <div className="hidden sm:block pointer-events-none absolute -left-40 top-50 h-57.5 w-102.5 rounded-full dark:bg-green-900/20 bg-green-500/30 blur-[120px]"/>

    </>
  );
}

export default BgStyle;
