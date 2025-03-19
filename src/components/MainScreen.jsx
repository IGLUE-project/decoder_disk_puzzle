import { useState } from "react";
import "./../assets/scss/MainScreen.scss";
import Wheel from "./Wheel";
import WheelResult from "./WheelResult";

export default function MainScreen({ show, initialConfig, solvePuzzle }) {
  const [result, setResult] = useState([]);

  const loadResult = (result, key) => {
    setResult((prev) => {
      const newResult = [...prev];
      newResult[key] = result;
      return newResult;
    });
  };

  return (
    <div id="MainScreen" className={"screen_wrapper" + (show ? "" : " screen_hidden")}>
      <div className="frame">
        <audio id="audio_click" src="sounds/click_button.wav" autostart="false" preload="auto" />
        <div
          className="wheels"
          style={{ width: 400 + 150 * (initialConfig.length - 1), height: 400 + 150 * (initialConfig.length - 1) }}
        >
          <div className="arrow"></div>
          <div className="subarrow"></div>
          {initialConfig.map((slices, index) => (
            <Wheel
              key={index}
              slices={slices}
              config={{ id: initialConfig.length - index }}
              size={{ width: 400 + 150 * index, height: 400 + 150 * index }}
              setResult={loadResult}
            />
          ))}
          <WheelResult result={result} size={{ width: 250, height: 250 }} />
        </div>
      </div>
    </div>
  );
}
