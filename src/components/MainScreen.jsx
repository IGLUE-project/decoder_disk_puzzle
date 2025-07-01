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
  const baseSize = Math.min(size.width, size.height);
  const wheelSize = (baseSize * 0.92) / (config.wheels.length + 1);

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
      setSize({ width: window.innerWidth, height: window.innerHeight });
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
      }),
    );
    winAudioOffset.current = Date.now();
    solvePuzzle(resultadosObj);
  };

  const setSolutions = (solutions) => {
    const parsedSolutions = solutions.split(";").reverse();
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
              width: baseSize * 0.92,
              height: baseSize * 0.92,
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
                  width: baseSize * 0.93 - wheelSize * (config.wheels.length - (index + 1)),
                  height: baseSize * 0.93 - wheelSize * (config.wheels.length - (index + 1)),
                }}
                solved={solved}
              />
            ))}
            <div className="wheel_shadow" id={`wheel_shadow_${config.skin}`}></div>
            <RoundButton
              onClick={pedirResultados}
              size={{ width: wheelSize, height: wheelSize }}
              buttonImage={config.buttonImg}
              buttonAudio={config.buttonAudio}
              solved={solved}
              disable={config.disableButton}
            />
          </div>
        )}
      </div>
    </div>
  );
}
