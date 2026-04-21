export default function Home() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0D0D0D",
    }}>
      <img
        src="/logo.svg"
        alt="Phenomenyon stu."
        style={{
          width: "clamp(120px, 20vw, 320px)",
          height: "auto",
          display: "block",
          filter: "invert(1)",
        }}
      />
    </div>
  )
}
