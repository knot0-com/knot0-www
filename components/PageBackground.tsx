export function PageBackground() {
  return (
    <>
      {/* Dot grid texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Amber radial glow */}
      <div
        className="fixed top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #ffb000 0%, transparent 70%)',
        }}
      />

      {/* Cyan accent glow */}
      <div
        className="fixed bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #4ecdc4 0%, transparent 70%)',
        }}
      />
    </>
  )
}
