import "./../assets/scss/RoundButton.scss";

const RoundButton = ({ onClick, size, buttonImage }) => {
  return (
    <div className="cover" style={{ width: size.width, height: size.height }}>
      <div className="button" onClick={() => onClick()}></div>
    </div>
  );
};

export default RoundButton;
