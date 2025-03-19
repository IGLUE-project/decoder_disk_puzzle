import React from "react";
import "./../assets/scss/ControlPanel.scss";
import { KEYPAD_SCREEN } from "../constants/constants";

const ControlPanel = ({ show, onOpenScreen }) => {
  return (
    <div id="ControlPanel" className={"screen_wrapper" + (show ? "" : " screen_hidden")}>
      <img src="/src/assets/images/panel_electrico.png" className="panel" onClick={() => onOpenScreen(KEYPAD_SCREEN)} />
    </div>
  );
};

export default ControlPanel;
