import React from "react";
import { useState, useEffect, useRef } from "react";
import "./../assets/scss/app.scss";
import "./../assets/scss/modal.scss";

import { GLOBAL_CONFIG } from "../config/config.js";
import * as I18n from "../vendors/I18n.js";
import * as LocalStorage from "../vendors/Storage.js";

import { CONTROL_PANEL_SCREEN, KEYPAD_SCREEN } from "../constants/constants.jsx";
import MainScreen from "./MainScreen.jsx";
import ControlPanel from "./ControlPanel.jsx";

let escapp;

const initialConfig = [
  [
    { color: "red", label: "a", img: "" },
    { color: "blue", label: "b", img: "" },
    { color: "green", label: "c", img: "" },
    { color: "yellow", label: "d", img: "" },
    { color: "purple", label: "e", img: "" },
    { color: "orange", label: "f", img: "" },
    { color: "brown", label: "g", img: "" },
  ],
  [
    { color: "red", label: "a", img: "" },
    { color: "blue", label: "b", img: "" },
    { color: "green", label: "c", img: "" },
    { color: "yellow", label: "d", img: "" },
    { color: "purple", label: "e", img: "" },
    { color: "orange", label: "f", img: "" },
    { color: "brown", label: "g", img: "" },
  ],
  [
    { color: "red", label: "a", img: "" },
    { color: "blue", label: "b", img: "" },
    { color: "green", label: "c", img: "" },
    { color: "yellow", label: "d", img: "" },
    { color: "purple", label: "e", img: "" },
    { color: "orange", label: "f", img: "" },
    { color: "brown", label: "ggg", img: "" },
  ],
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(KEYPAD_SCREEN);
  const [prevScreen, setPrevScreen] = useState(KEYPAD_SCREEN);
  const [fail, setFail] = useState(false);

  useEffect(() => {
    console.log("useEffect, lets load everything");
    //localStorage.clear();  //For development, clear local storage (comentar y descomentar para desarrollo)
    I18n.init(GLOBAL_CONFIG);
    LocalStorage.init(GLOBAL_CONFIG.localStorageKey);
    GLOBAL_CONFIG.escapp.onNewErStateCallback = (er_state) => {
      console.log("New ER state received from ESCAPP", er_state);
      restoreState(er_state);
    };
    GLOBAL_CONFIG.escapp.onErRestartCallback = (er_state) => {
      // reset(); //For development
      console.log("Escape Room Restart received from ESCAPP", er_state);
      LocalStorage.removeSetting("app_state");
      LocalStorage.removeSetting("played_door");
    };
    escapp = new ESCAPP(GLOBAL_CONFIG.escapp);
    escapp.validate((success, er_state) => {
      console.log("ESCAPP validation", success, er_state);
      try {
        if (success) {
          //ha ido bien, restauramos el estado recibido
          restoreState(er_state);
        }
      } catch (e) {
        console.error(e);
      }
    });

    setLoading(false);
  }, []);

  const solvePuzzle = (solution) => {
    //XXX DUDA: a este método solo se le llama cuando sale el boton continue, que es cuando se han resuelto todos los puzzles

    //XXX DUDA: en el de MalditaER se guarda en localstorage con la clave "safebox_password", quizá sirva por si se vuelve a recargar o se vuelve a la app, que el estado se pierde.
    //lo mejor seria guardar en localstorage todo el estado de la app cuando algo cambia y asi al volver a cargar la app se restaura el estado en el useEffect
    console.log(solution);
    escapp.submitPuzzle(GLOBAL_CONFIG.escapp.puzzleId, JSON.stringify(solution), {}, (success) => {
      if (!success) {
        // alert("ta mal");
      } else {
        // alert("ta bien");
      }
    });
  };

  function reset() {
    escapp.reset();
    localStorage.clear();
  }

  function restoreState(er_state) {
    console.log("Restoring state", er_state);
    if (typeof er_state !== "undefined" && er_state.puzzlesSolved.length > 0) {
      let lastPuzzleSolved = Math.max.apply(null, er_state.puzzlesSolved);
      if (lastPuzzleSolved >= GLOBAL_CONFIG.escapp.puzzleId) {
        //puzzle superado, abrimos la caja fuerte
        setScreen(KEYPAD_SCREEN);
        setPrevScreen(KEYPAD_SCREEN);
      } else {
        //puzzle no superado, miramos en localStorage en qué pantalla estábamos
        let localstateToRestore = LocalStorage.getSetting("app_state");
        console.log("Restoring screen from local state", localstateToRestore);
        if (localstateToRestore) {
          setScreen(localstateToRestore.screen);
          setPrevScreen(localstateToRestore.prevScreen);
        }
      }
      setLoading(false);
    } else {
      restoreLocalState();
    }
  }

  function saveState() {
    console.log("Saving state to local storage");
    let currentState = { screen: screen, prevScreen: prevScreen };
    LocalStorage.saveSetting("app_state", currentState);
  }

  function restoreLocalState() {
    let stateToRestore = LocalStorage.getSetting("app_state");
    console.log("Restoring local state", stateToRestore);
    if (stateToRestore) {
      setScreen(stateToRestore.screen);
      setPrevScreen(stateToRestore.prevScreen);
      setLoading(false);
    }
  }

  function onOpenScreen(newscreen_name) {
    console.log("Opening screen", newscreen_name);
    setPrevScreen(screen);
    setScreen(newscreen_name);
    saveState();
  }

  /*
  //COMENTADO PORQUE NO SE USA EN EL EJEMPLO, serviría para saber si se han superado todos los puzzles 
  // y entonces se muestra un mensaje u otro en la pantalla final
  //
  let puzzlesSolved = [];
  let solvedAllPuzzles = false;
  if(!escapp){
    //si no esta definido escapp, es que estamos loading
    setLoading(true);
  } else {
    let newestState = escapp.getNewestState();
    puzzlesSolved = (newestState && newestState.puzzlesSolved) ? newestState.puzzlesSolved : [];
    //en este ejemplo se han superado todos los puzzles si se han superado 3 que es el total de la ER
    solvedAllPuzzles = newestState.puzzlesSolved.length >= 3;
  }
  */

  return (
    <div id="firstnode">
      <audio id="audio_failure" src="sounds/wrong.wav" autostart="false" preload="auto" />
      <div className={`main-background ${fail ? "fail" : ""}`}>
        <MainScreen show={screen === KEYPAD_SCREEN} initialConfig={initialConfig} solvePuzzle={solvePuzzle} />
        <ControlPanel show={screen === CONTROL_PANEL_SCREEN} onOpenScreen={onOpenScreen} />
      </div>
    </div>
  );
}
