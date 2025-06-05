import React, { useState } from "react";
import "./../assets/scss/ControlPanel.scss";
import { AREACOLOR, ICONS, THEMES, WHEELTYPE } from "../constants/constants";

const ControlPanel = ({ loadConfig }) => {
  const [theme, setTheme] = useState("BASIC");
  const [ruedas, setRuedas] = useState([]);

  const añadirRueda = () => {
    setRuedas((prev) => {
      let newRuedas = [...prev];
      newRuedas.push({ type: WHEELTYPE.LETTERS, length: 6 });
      return newRuedas;
    });
  };
  const añadirSeccion = (idxRueda) => {
    setRuedas((prev) => {
      let newRuedas = [...prev];
      if (!newRuedas[idxRueda].customWheel) newRuedas[idxRueda].customWheel = [];
      newRuedas[idxRueda].customWheel.push({ areaColor: "#ff0000", colorIco: "#00ff00", label: "", img: "", ico: "" });
      return newRuedas;
    });
  };

  const setTipoAreaRueda = (idx, type) => {
    setRuedas((prev) => {
      let newRuedas = [...prev];
      newRuedas[idx].areaColor = type;
      return newRuedas;
    });
  };
  const setTipoRueda = (idx, type) => {
    setRuedas((prev) => {
      let newRuedas = [...prev];
      newRuedas[idx].type = type;
      return newRuedas;
    });
  };
  const setSizeRueda = (idx, length) => {
    setRuedas((prev) => {
      let newRuedas = [...prev];
      newRuedas[idx].length = length;
      return newRuedas;
    });
  };

  const setSliceProp = (idxRueda, idxSlice, prop, value) => {
    setRuedas((prev) => {
      let newRuedas = [...prev];
      newRuedas[idxRueda].customWheel[idxSlice][prop] = value;
      return newRuedas;
    });
  };

  const irPuzzle = () => {
    loadConfig({ config: { theme, nWheels: ruedas.length }, wheels: ruedas });
  };
  return (
    <div id="ControlPanel" style={{ alignItems: "center" }}>
      <div
        className="frame"
        style={{
          backgroundColor: "gray",
          height: "90%",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          overflow: "auto",
        }}
      >
        <div style={{ padding: "50px 100px" }}>
          <h2>Configuracion de rueda</h2>
          <div className="tema">
            <label htmlFor="tema">Tema:</label>{" "}
            <select id="tema" name="tema" value={theme} onChange={(e) => setTheme(e.target.value)}>
              {Object.entries(THEMES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: "100%", height: "2px", backgroundColor: "black", margin: "20px 0" }} />

          {ruedas.map((w, i) => (
            <div key={i}>
              <div className="tipo">
                <p>Rueda: {i + 1 + "    "}</p>
                <label htmlFor={"tipo" + i}>tipo:</label>{" "}
                <select
                  id={"tipo" + i}
                  name={"tipo" + i}
                  onChange={(e) => setTipoRueda(i, e.target.value)}
                  style={{ marginRight: "15px" }}
                >
                  {Object.entries(WHEELTYPE).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                Número de secciones:{" "}
                <input
                  type="number"
                  name="volume"
                  min="1"
                  max="15"
                  step="1"
                  value={ruedas[i].length}
                  onChange={(e) => setSizeRueda(i, e.target.value)}
                  style={{ marginRight: "15px" }}
                />
                color de areas:{" "}
                <select
                  id={"tipo" + i}
                  name={"tipo" + i}
                  onChange={(e) => setTipoAreaRueda(i, e.target.value)}
                  style={{ marginRight: "15px" }}
                >
                  {Object.entries(AREACOLOR).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              {ruedas[i].type === WHEELTYPE.CUSTOM && (
                <div>
                  <p>Secciones personalizadas</p>
                  {ruedas[i].customWheel &&
                    ruedas[i].customWheel.map((seccion, j) => (
                      <div key={j} style={{ margin: "10px" }}>
                        <span style={{ marginRight: "15px" }}>Sección {j + 1}</span>
                        <label htmlFor={"label" + i}>label: </label>
                        <input
                          type="text"
                          name={"label" + i}
                          id={"label" + i}
                          onChange={(e) => setSliceProp(i, j, "label", e.target.value)}
                          style={{ marginRight: "15px" }}
                        />
                        <label htmlFor={"ico" + i}>ico: </label>
                        <select
                          id={"ico" + i}
                          name={"ico" + i}
                          onChange={(e) => setSliceProp(i, j, "ico", e.target.value)}
                          style={{ marginRight: "15px" }}
                        >
                          <option value={""}>{""}</option>
                          {Object.entries(ICONS).map(([key, value]) => (
                            <option key={key} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                        <label htmlFor={"areaColor" + i}>area color: </label>
                        <input
                          type="color"
                          id={"areaColor" + i}
                          name={"areaColor" + i}
                          onChange={(e) => setSliceProp(i, j, "areaColor", e.target.value)}
                          style={{ marginRight: "15px" }}
                        ></input>
                        <label htmlFor={"colorIco" + i}>color icono: </label>
                        <input
                          type="color"
                          id={"colorIco" + i}
                          name={"colorIco" + i}
                          onChange={(e) => setSliceProp(i, j, "colorIco", e.target.value)}
                          style={{ marginRight: "15px" }}
                        ></input>
                      </div>
                    ))}
                  <button style={{ margin: "0 10px " }} onClick={() => añadirSeccion(i)}>
                    añadir sección
                  </button>
                </div>
              )}
              <div style={{ width: "100%", height: "2px", backgroundColor: "black", margin: "20px 0" }} />
            </div>
          ))}
          <button style={{ margin: "0 10px " }} onClick={() => añadirRueda()}>
            {" "}
            añadir rueda
          </button>
          <button onClick={() => irPuzzle()}> ir al puzzle</button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
