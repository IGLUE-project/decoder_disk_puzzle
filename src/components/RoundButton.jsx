import "./../assets/scss/RoundButton.scss";

const RoundButton = ({ onClick, size, buttonImage, buttonAudio }) => {
  const click = () => {
    if (buttonAudio) new Audio(buttonAudio).play();
    onClick();
  };

  return (
    <div className={buttonImage ? "cover image" : "cover"} style={{ width: size.width, height: size.height }}>
      {buttonImage ? (
        <img onClick={() => click()} src={buttonImage} alt="button" />
      ) : (
        <div className="button" onClick={() => click()}></div>
      )}
    </div>
  );
};
export default RoundButton;
