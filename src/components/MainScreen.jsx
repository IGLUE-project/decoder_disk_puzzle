import React, { useEffect, useRef, useState } from "react";
import "./../assets/scss/MainScreen.scss";
import RoundButton from "./RoundButton";
import Wheel from "./Wheel";

export default function MainScreen({ show, solvePuzzle, config, solved }) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const aspectRatio = 16 / 9;
      let width = windowWidth * 0.9;
      let height = width / aspectRatio;

      if (height > windowHeight * 0.9) {
        height = windowHeight * 0.9;
        width = height * aspectRatio;
      }
      console.log("size", { width, height });

      setSize({ width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const refs = useRef([...Array(config.wheels.length)].map(() => React.createRef()));

  const pedirResultados = () => {
    const resultados = refs.current.map((ref) => ref.current?.getResult()).filter((r) => r !== undefined);
    const resultadosObj = Object.fromEntries(resultados.map(({ id, value }) => [id, value]));
    solvePuzzle(resultadosObj);
  };

  return (
    <div id="MainScreen" className={"screen_wrapper" + (show ? "" : " screen_hidden")}>
      <div className="frame">
        {config.wheels && (
          <div
            className="wheels"
            style={{
              width: size.height * 0.424 + size.height * 0.182 * (config.wheels.length - 1),
              height: size.height * 0.424 + size.height * 0.182 * (config.wheels.length - 1),
            }}
          >
            <div className="arrow"></div>
            <div className="subarrow"></div>
            {config.wheels.map((wheel, index) => (
              <Wheel
                key={index}
                ref={refs.current[index]}
                wheel={wheel}
                theme={config.theme}
                wheelImg={config.theme.wheelImg}
                config={{ id: config.wheels.length - index }}
                size={{
                  width: size.height * 0.424 + size.height * 0.182 * index,
                  height: size.height * 0.424 + size.height * 0.182 * index,
                }}
                solved={solved}
              />
            ))}
            <div className="wheel_shadow" id={`wheel_shadow_${config.theme.name}`}></div>
            <RoundButton
              onClick={pedirResultados}
              size={{ width: size.height * 0.242, height: size.height * 0.242 }}
              buttonImage={config.theme.buttonImg}
              buttonAudio={config.theme.buttonAudio}
            />
          </div>
        )}
      </div>
    </div>
  );
}
