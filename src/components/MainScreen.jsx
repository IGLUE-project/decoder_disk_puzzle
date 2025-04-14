import { useEffect, useRef, useState } from "react";
import "./../assets/scss/MainScreen.scss";
import RoundButton from "./RoundButton";
import Wheel from "./Wheel";

export default function MainScreen({ show, solvePuzzle, config }) {
  const [result, setResult] = useState({});
  const prevResultRef = useRef(null);

  const loadResult = (result, key) => {
    setResult((prev) => ({
      ...prev,
      [key]: result,
    }));
  };

  useEffect(() => {
    if (prevResultRef.current && JSON.stringify(prevResultRef.current) !== JSON.stringify(result)) {
      new Audio(config.theme?.moveAudio).play();
    }
    prevResultRef.current = result;
  }, [result]);

  const onCentralButtonClick = () => solvePuzzle(result);

  return (
    <div id="MainScreen" className={"screen_wrapper" + (show ? "" : " screen_hidden")}>
      <div className="frame">
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
                theme={config.theme}
                wheelImg={config.theme.wheelImg}
                config={{ id: config.wheels.length - index }}
                size={{ width: 350 + 150 * index, height: 350 + 150 * index }}
                setResult={loadResult}
              />
            ))}
            <div className="wheel_shadow">
 
            </div>
            <RoundButton
              onClick={onCentralButtonClick}
              size={{ width: 200, height: 200 }}
              buttonImage={config.theme.buttonImg}
              buttonAudio={config.theme.buttonAudio}
            />
          </div>
        )}
      </div>
    </div>
  );
}
