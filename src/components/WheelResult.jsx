import "../assets/scss/WheelResult.scss";

export default function WheelResult({ result, size }) {
  return (
    <div id="WheelResult" style={{ width: size.width, height: size.height, zIndex: 100 }}>
      <span>{result}</span>
    </div>
  );
}
