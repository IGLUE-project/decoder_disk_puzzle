import React, { useEffect, useState } from "react";
import "./../assets/scss/app.scss";
import "./../assets/scss/modal.scss";

import { GLOBAL_CONFIG } from "../config/config.js";
import * as I18n from "../vendors/I18n.js";
import * as LocalStorage from "../vendors/Storage.js";

import {
  AREACOLOR,
  CONTROL_PANEL_SCREEN,
  ICONS,
  KEYPAD_SCREEN,
  THEME_IMAGES,
  THEMES,
  WHEELTYPE,
} from "../constants/constants.jsx";
import ControlPanel from "./ControlPanel.jsx";
import MainScreen from "./MainScreen.jsx";

let escapp;

const initialConfig = {
  config: {
    nWheels: 4,
    theme: THEMES.ANCIENT,
  },
  wheels: [
    {
      type: "numbers",
      length: 6,
    },
    {
      type: WHEELTYPE.COLORED_SHAPES,
      length: 6,
    },
    {
      type: WHEELTYPE.LETTERS,
      length: 6,
      customWheel: [
        { areaColor: "#ff0000", colorIco: "brown", label: "a", img: "", ico: "circle" },
        { areaColor: "#ffff00", colorIco: "red", label: "b", img: "", ico: "triangle" },
        { areaColor: "#ff00ff", colorIco: "blue", label: "c", img: "", ico: "square" },
        { areaColor: "#00ff00", colorIco: "green", label: "d", img: "", ico: "pentagon" },
        { areaColor: "#00ffff", colorIco: "yellow", label: "e", img: "", ico: "star" },
        { areaColor: "#0000ff", colorIco: "purple", label: "f", img: "", ico: "hexagon" },
        { areaColor: "#ff0000", colorIco: "orange", label: "g", img: "", ico: "asdasd" },
      ],
    },
  ],
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(KEYPAD_SCREEN);
  const [prevScreen, setPrevScreen] = useState(KEYPAD_SCREEN);
  const [fail, setFail] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    console.log("useEffect, lets load everything");
    //localStorage.clear();  //For development, clear local storage (comentar y descomentar para desarrollo)
    I18n.init(GLOBAL_CONFIG);
    LocalStorage.init(GLOBAL_CONFIG.localStorageKey);

    escapp = new ESCAPP(GLOBAL_CONFIG.escapp);
    // escapp.validate((success, er_state) => {
    //   console.log("ESCAPP validation", success, er_state);
    //   try {
    //     if (success) {
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // });
    loadConfig(initialConfig);

    setLoading(false);
  }, []);

  function loadConfig({ config, wheels }) {
    let configuration = {
      theme: {
        name: config.theme,
        ...(THEME_IMAGES[config.theme] || {}),
      },
      wheels: [],
    };

    for (let i = 0; i < config.nWheels; i++) {
      const wheel = wheels[i];
      let newWheel = wheel ? { ...wheel, wheel: [] } : null;

      if (newWheel) {
        let wheelData;
        switch (wheel.type) {
          case WHEELTYPE.NUMBERS:
            wheelData = (_, j) => ({ label: j + 1 });
            break;
          case WHEELTYPE.COLORS:
            wheelData = () => ({ label: "" });
            break;
          case WHEELTYPE.SHAPES:
            wheelData = (_, j) => ({ ico: ICONS[j % ICONS.length] || "" });
            break;
          case WHEELTYPE.COLORED_SHAPES:
            wheelData = (_, j) => ({ ico: ICONS[j % ICONS.length] || "", colorIco: AREACOLOR.RAINBOW });
            break;
          case WHEELTYPE.CUSTOM:
            newWheel.wheel = wheel.customWheel;
            break;
          default:
            wheelData = (_, j) => ({ label: String.fromCharCode(65 + (j % 26)) });
        }

        if (wheel.type !== WHEELTYPE.CUSTOM) {
          newWheel.wheel = Array.from({ length: wheel.length }, wheelData);
        }
        configuration.wheels.push(newWheel);
      } else {
        configuration.wheels.push({
          type: WHEELTYPE.LETTERS,
          length: 6,
          wheel: Array.from({ length: 6 }, (_, j) => ({ label: String.fromCharCode(65 + j) })),
        });
      }
    }
    console.log(configuration);
    setConfig(configuration);
  }

  const solvePuzzle = (solution) => {
    const parsedSolution = Object.values(solution).join(",");
    console.log(parsedSolution);
    escapp.submitPuzzle(GLOBAL_CONFIG.escapp.puzzleId, JSON.stringify(parsedSolution), {}, (success) => {
      if (!success) {
        // alert("ta mal");
      } else {
        // alert("ta bien");
      }
    });
  };

  function onOpenScreen(newscreen_name) {
    console.log("Opening screen", newscreen_name);
    setPrevScreen(screen);
    setScreen(newscreen_name);
  }

  return (
    <div id="firstnode">
      <audio id="audio_failure" src="sounds/wrong.wav" autostart="false" preload="auto" />
      <div className={`main-background ${fail ? "fail" : ""}`}>
        <MainScreen
          show={screen === KEYPAD_SCREEN}
          initialConfig={initialConfig.customWheels}
          solvePuzzle={solvePuzzle}
          config={config}
        />
        <ControlPanel show={screen === CONTROL_PANEL_SCREEN} onOpenScreen={onOpenScreen} />
      </div>
    </div>
  );
}
