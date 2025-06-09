import { useContext, useEffect, useRef, useState } from "react";
import "./../assets/scss/app.scss";
import "./../assets/scss/modal.scss";

import {
  ALLOWED_ACTIONS,
  AREACOLOR,
  CONTROL_PANEL_SCREEN,
  DEFAULT_APP_SETTINGS,
  ESCAPP_CLIENT_SETTINGS,
  ICONS,
  KEYPAD_SCREEN,
  THEME_ASSETS,
  WHEELTYPE,
} from "../constants/constants.jsx";
import ControlPanel from "./ControlPanel.jsx";
import MainScreen from "./MainScreen.jsx";
import { GlobalContext } from "./GlobalContext.jsx";

export default function App() {
  const { escapp, setEscapp, appSettings, setAppSettings, Storage, setStorage, Utils, I18n } = useContext(GlobalContext);
  const hasExecutedEscappValidation = useRef(false);

  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(KEYPAD_SCREEN);
  const prevScreen = useRef(screen);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    //Init Escapp client
    if (escapp !== null) {
      return;
    }
    //Create the Escapp client instance.
    let _escapp = new ESCAPP(ESCAPP_CLIENT_SETTINGS);
    setEscapp(_escapp);
    Utils.log("Escapp client initiated with settings:", _escapp.getSettings());

    //Use the storage feature provided by Escapp client.
    setStorage(_escapp.getStorage());

    //Get app settings provided by the Escapp server.
    let _appSettings = processAppSettings(_escapp.getAppSettings());
    setAppSettings(_appSettings);
  }, []);

  useEffect(() => {
    if (!hasExecutedEscappValidation.current && escapp !== null && appSettings !== null && Storage !== null) {
      hasExecutedEscappValidation.current = true;

      //Register callbacks in Escapp client and validate user.
      escapp.registerCallback("onNewErStateCallback", function (erState) {
        try {
          Utils.log("New escape room state received from ESCAPP", erState);
          restoreAppState(erState);
        } catch (e) {
          Utils.log("Error in onNewErStateCallback", e);
        }
      });

      escapp.registerCallback("onErRestartCallback", function (erState) {
        try {
          Utils.log("Escape Room has been restarted.", erState);
          if (typeof Storage !== "undefined") {
            Storage.removeSetting("state");
          }
        } catch (e) {
          Utils.log("Error in onErRestartCallback", e);
        }
      });

      //Validate user. To be valid, a user must be authenticated and a participant of the escape room.
      escapp.validate((success, erState) => {
        try {
          Utils.log("ESCAPP validation", success, erState);
          if (success) {
            restoreAppState(erState);
            setLoading(false);
          }
        } catch (e) {
          Utils.log("Error in validate callback", e);
        }
      });
    }
  }, [escapp, appSettings, Storage]);

  useEffect(() => {
    if (screen !== prevScreen.current) {
      Utils.log("Screen ha cambiado de", prevScreen.current, "a", screen);
      prevScreen.current = screen;
    }
  }, [screen]);

  function restoreAppState(erState) {
    Utils.log("Restore application state based on escape room state:", erState);
    // Si el puzle está resuelto lo ponemos en posicion de resuelto
    if (escapp.getAllPuzzlesSolved()) {
      if (appSettings.actionAfterSolve === "SHOW_MESSAGE") {
        setSolved(true);
        setSolution(erState.puzzleData[escapp.getSettings().nextPuzzleId].solution || null);
      }
    }
  }

  function processAppSettings(_appSettings) {
    if (typeof _appSettings !== "object") {
      _appSettings = {};
    }

    let skinSettings = THEME_ASSETS[_appSettings.skin] || {};

    let DEFAULT_APP_SETTINGS_SKIN = Utils.deepMerge(DEFAULT_APP_SETTINGS, skinSettings);

    // Merge _appSettings with DEFAULT_APP_SETTINGS_SKIN to obtain final app settings
    _appSettings = Utils.deepMerge(DEFAULT_APP_SETTINGS_SKIN, _appSettings);

    if (!ALLOWED_ACTIONS.includes(_appSettings.actionAfterSolve)) {
      _appSettings.actionAfterSolve = DEFAULT_APP_SETTINGS.actionAfterSolve;
    }

    _appSettings.wheels = [];
    for (let i = 0; i < _appSettings.numberOfWheels; i++) {
      const wheel = _appSettings.wheelsType[i];
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
        _appSettings.wheels.push(newWheel);
      } else {
        _appSettings.wheels.push({
          type: WHEELTYPE.LETTERS,
          length: 6,
          wheel: Array.from({ length: 6 }, (_, j) => ({ label: String.fromCharCode(65 + j) })),
        });
      }
    }

    //Init internacionalization module
    I18n.init(_appSettings);

    if (typeof _appSettings.message !== "string") {
      _appSettings.message = I18n.getTrans("i.message");
    }

    //Change HTTP protocol to HTTPs in URLs if necessary
    _appSettings = Utils.checkUrlProtocols(_appSettings);

    //Preload resources (if necessary)
    Utils.preloadImages([_appSettings.backgroundMessage]);
    //Utils.preloadAudios([_appSettings.soundBeep,_appSettings.soundNok,_appSettings.soundOk]); //Preload done through HTML audio tags
    //Utils.preloadVideos(["videos/some_video.mp4"]);
    Utils.log("App settings:", _appSettings);
    return _appSettings;
  }

  function loadConfig({ config, wheels }) {
    setScreen(KEYPAD_SCREEN);
    let skinSettings = THEME_ASSETS[config.theme] || {};
    let baseConfig = Utils.deepMerge(DEFAULT_APP_SETTINGS, skinSettings);
    baseConfig.wheelsType = wheels;
    baseConfig.skin = config.theme || "BASIC";
    baseConfig.numberOfWheels = config.nWheels || 3;
    const newConfig = processAppSettings(baseConfig);
    setAppSettings(newConfig);
  }

  function solvePuzzle(_solution) {
    Utils.log("solution: ", _solution);

    const parsedSolution = Object.values(_solution)
      .map((value) => value + 1)
      .join(",");
    setSolution(parsedSolution);

    switch (appSettings.actionAfterSolve) {
      case "SHOW_MESSAGE":
        return checkResult(parsedSolution);
      case "NONE":
      default:
        return submitPuzzleSolution(parsedSolution);
    }
  }
  function checkResult(_solution) {
    escapp.checkNextPuzzle(_solution, {}, (success, erState) => {
      Utils.log("Check solution Escapp response", success, erState);
      if (success) {
        setSolved(true);
        try {
          setTimeout(() => {
            submitPuzzleSolution(_solution);
          }, 2000);
        } catch (e) {
          Utils.log("Error in checkNextPuzzle", e);
        }
      }
    });
  }
  function submitPuzzleSolution(_solution) {
    Utils.log("Submit puzzle solution", _solution);

    escapp.submitNextPuzzle(_solution, {}, (success, erState) => {
      if (!success) {
        setSolved(true);
      }
      Utils.log("Solution submitted to Escapp", _solution, success, erState);
    });
  }

  const renderScreens = (screens) => {
    if (loading === true) {
      return null;
    } else {
      return <>{screens.map(({ id, content }) => renderScreen(id, content))}</>;
    }
  };

  const renderScreen = (screenId, screenContent) => (
    <div key={screenId} className={`screen_wrapper ${screen === screenId ? "active" : ""}`}>
      {screenContent}
    </div>
  );

  let screens = [
    {
      id: KEYPAD_SCREEN,
      content: (
        <div className="main-background" style={{ backgroundImage: appSettings?.backgroundImg ? `url(${appSettings.backgroundImg})` : {} }}>
          <MainScreen solvePuzzle={solvePuzzle} config={appSettings} solved={solved} solution={solution} />
        </div>
      ),
    },
    {
      id: CONTROL_PANEL_SCREEN,
      content: <ControlPanel loadConfig={loadConfig} />,
    },
  ];

  return (
    <div
      id="global_wrapper"
      className={`${appSettings !== null && typeof appSettings.skin === "string" ? appSettings.skin.toLowerCase() : ""}`}
    >
      {renderScreens(screens)}
    </div>
  );
}
