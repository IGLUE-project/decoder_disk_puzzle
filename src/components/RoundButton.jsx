import "./../assets/scss/RoundButton.scss";

const RoundButton = ({ onClick, size, buttonImage, buttonAudio, solved, disable }) => {
  const click = () => {
    if (!solved && !disable) {
      if (buttonAudio) new Audio(buttonAudio).play();
      onClick();
    }
  };

  return (
    <div
      className={"submitButton " + (buttonImage ? "cover image" : "cover") + (disable ? " disable" : "")}
      style={{ width: size.width, height: size.height }}
    >
      {buttonImage ? (
        <img onClick={() => click()} src={buttonImage} alt="button" draggable={false} />
      ) : (
        <div className="button" onClick={() => click()}></div>
      )}
    </div>
  );
};
export default RoundButton;
