import { useState } from "react";
import "./../assets/scss/MainScreen.scss";
import RoundButton from "./RoundButton";
import Wheel from "./Wheel";

export default function MainScreen({ show, initialConfig, solvePuzzle, config }) {
  const [result, setResult] = useState({});

  const loadResult = (result, key) => {
    setResult((prev) => ({
      ...prev,
      [key]: result,
    }));
  };

  const onCentralButtonClick = () => solvePuzzle(result);

  return (
    <div id="MainScreen" className={"screen_wrapper" + (show ? "" : " screen_hidden")}>
      <div className="frame">
        <audio id="audio_click" src="sounds/click_button.wav" autostart="false" preload="auto" />
        {config.wheels && (
          <div
            className="wheels"
            style={{ width: 350 + 150 * (config.wheels.length - 1), height: 350 + 150 * (config.wheels.length - 1) }}
          >
            <div className="arrow"></div>
            <div className="subarrow"></div>
            {config.wheels.map((wheel, index) => (
              <Wheel
                key={index}
                wheel={wheel}
                wheelImg={config.theme.wheelImg}
                config={{ id: config.wheels.length - index }}
                size={{ width: 350 + 150 * index, height: 350 + 150 * index }}
                setResult={loadResult}
              />
            ))}
            <RoundButton
              onClick={onCentralButtonClick}
              size={{ width: 200, height: 200 }}
              buttonImage={config.theme.buttonImg}
            />
          </div>
        )}
      </div>
    </div>
  );
}
