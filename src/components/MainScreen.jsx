import React, { useEffect, useRef, useState } from "react";
import "./../assets/scss/MainScreen.scss";
import RoundButton from "./RoundButton";
import Wheel from "./Wheel";

export default function MainScreen({ solvePuzzle, config, solved, solution }) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const refs = useRef(null);
  const [refsLoaded, setRefsLoaded] = useState(0);

  useEffect(() => {
    if (solved && solution) {
      setSolutions(solution);
    }
  }, [solved, solution, refsLoaded]);

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

      setSize({ width, height });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!config) return;
    refs.current = [...Array(config.wheels.length)].map(() => React.createRef());
    setRefsLoaded((prev) => prev + 1);
  }, [config]);

  const pedirResultados = () => {
    const resultados = refs.current.map((ref) => ref.current?.getResult()).filter((r) => r !== undefined);
    const resultadosObj = Object.fromEntries(resultados.map(({ id, value }) => [id, value]));
    solvePuzzle(resultadosObj);
  };

  const setSolutions = (solutions) => {
    const parsedSolutions = solutions
      .split(",")
      .map(Number)
      .map((n) => n - 1)
      .reverse();
    if (!refs.current) return;
    if (refs.current[0]) new Audio(config.winAudio).play();
    refs.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.setSolution(parsedSolutions[index]);
      }
    });
  };

  return (
    <div id="MainScreen" className={solved ? "solved" : ""}>
      <div className="frame">
        {config?.wheels && refs.current && (
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
                theme={config}
                wheelImg={config.wheelImg}
                config={{ id: config.wheels.length - index }}
                size={{
                  width: size.height * 0.424 + size.height * 0.182 * index,
                  height: size.height * 0.424 + size.height * 0.182 * index,
                }}
                solved={solved}
              />
            ))}
            <div className="wheel_shadow" id={`wheel_shadow_${config.skin}`}></div>
            <RoundButton
              onClick={pedirResultados}
              size={{ width: size.height * 0.242, height: size.height * 0.242 }}
              buttonImage={config.buttonImg}
              buttonAudio={config.buttonAudio}
              solved={solved}
            />
          </div>
        )}
      </div>
    </div>
  );
}
