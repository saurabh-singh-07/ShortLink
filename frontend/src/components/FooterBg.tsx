
function FooterBg() {
  return (
    <>
      {/* Top emerald glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[100px]" />

      {/* Bottom-left green glow */}
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />

      {/* Bottom-right green glow */}
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[400px] w-[500px] rounded-full bg-green-600/[0.08] blur-[120px]" />

      {/* Subtle curved top edge */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[160px] w-[120%] -translate-x-1/2 rounded-[50%] border-t border-emerald-400/20 bg-gradient-to-b from-emerald-500/[0.05] to-transparent" />
    </>
  );
}

export default FooterBg;
