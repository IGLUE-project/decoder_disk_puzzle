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
  const winAudioOffset = useRef(0);
  const [refsLoaded, setRefsLoaded] = useState(0);

  useEffect(() => {
    if (solved && solution && refsLoaded) {
      const now = Date.now();
      const elapsed = now - winAudioOffset.current;
      const delay = Math.max(0, 1200 - elapsed);

      const timeout = setTimeout(() => {
        setSolutions(solution);
      }, delay);

      return () => clearTimeout(timeout);
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
    const resultados = refs.current.map((ref) => ref.current?.getResult()).filter(Boolean);

    const resultadosObj = Object.fromEntries(
      resultados.map(({ id, value }) => {
        const wheelIndex = config.wheels.length - id;
        const slice = config.wheels[wheelIndex].wheel[value];
        const result = [slice.ico, slice.label, slice.areaColor].find((v) => v?.toString().trim());

        return [wheelIndex, result];
      })
    );
    winAudioOffset.current = Date.now();
    solvePuzzle(resultadosObj);
  };

  const setSolutions = (solutions) => {
    const parsedSolutions = solutions.split(";");
    if (!refs.current) return;

    if (refs.current[0]) new Audio(config.winAudio).play();

    refs.current.forEach((ref, index) => {
      if (!ref.current) return;

      const wheel = config.wheels[index].wheel;
      const sol = parsedSolutions[index];

      const id = wheel.findIndex(({ ico, label, areaColor }) => [ico, label, areaColor].includes(sol));

      ref.current.setSolution(id >= 0 ? id : 0);
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
