import { useEffect, useRef } from "react";
import "../assets/scss/Wires.scss";

const boltImg = new Image();
boltImg.src = "/src/assets/images/bolt.png";
const backgroundImg = new Image();
backgroundImg.src = "/src/assets/images/background.jpg";

const canvasWidth = 1010;
const canvasHeight = 1000;
let mouseX = 0;
let mouseY = 0;

const FixWiringGame = ({ initialConfig, solvePuzzle }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    //Cables reordenados en funcion del target (para lso cuadros de arriba)
    const wires = initialConfig.wires;
    const targets = initialConfig.target;
    let selectedWireIndex = -1;
    let gameCompleted = false;
    //Wire Area width/height
    const WAWidth = canvasWidth / wires.length;
    const WAHeight = 150;

    let conexions = [];
    wires.forEach(() => conexions.push(null));

    // Dibuja el estado del juego
    function drawGame() {
      ctx.fillStyle = "#888";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight);
      // Dibujar la línea actual si se está arrastrando
      if (selectedWireIndex > -1) {
        drawLine(
          wires[selectedWireIndex].color,
          selectedWireIndex * WAWidth + WAWidth / 2,
          canvasHeight - WAHeight,
          mouseX,
          mouseY,
        );
      }

      // Dibujar los cuadros de abajo y las líneas completadas
      wires.forEach((wire, i) => {
        drawRect(wire.color, WAWidth * i, canvasHeight - WAHeight, WAWidth, WAHeight);
        if (conexions[i] !== null) {
          drawLine(
            wire.color,
            i * WAWidth + WAWidth / 2,
            canvasHeight - WAHeight,
            conexions[i] * WAWidth + WAWidth / 2,
            WAHeight,
          );
        }
        ctx.drawImage(boltImg, i * WAWidth + WAWidth / 2 - 35, canvasHeight - WAHeight - 35, 70, 70);
        drawLabel(wire, i, canvasHeight - WAHeight / 2);
      });
      // Dibujar los cuadros de arriba
      targets.forEach((target, i) => {
        drawRect(target.colorArea, WAWidth * i, 0, WAWidth, WAHeight);
        ctx.drawImage(boltImg, i * WAWidth + WAWidth / 2 - 35, WAHeight - 35, 70, 70);
        drawLabel(target, i, WAHeight / 2);
      });

      if (gameCompleted) {
        //Juego ganado
      }
    }

    // Dibuja un rectángulo
    function drawRect(color, x, y, w, h) {
      //ctx.globalAlpha = 0.5;
      //ctx.fillStyle = color ? color : "#3b3b3b";

      ctx.fillStyle = "#3b3b3b";
      ctx.fillRect(x, y, w, h);
      // ctx.globalAlpha = 1.0;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
    }

    // Dibuja una línea entre dos puntos
    function drawLine(color, x1, y1, x2, y2) {
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

      // Generar colores más oscuros y más claros del color base
      const darkerColor = shadeColor(color, -40); // Más oscuro
      const lighterColor = shadeColor(color, 40); // Más claro

      gradient.addColorStop(0, darkerColor); // Extremo más oscuro
      gradient.addColorStop(0.5, lighterColor); // Centro más claro
      gradient.addColorStop(1, darkerColor); // Otro extremo oscuro

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2 + 50; // Agrega un poco de curvatura

      // Primero dibujamos el borde negro
      ctx.strokeStyle = "black";
      ctx.lineWidth = 25; // Un poco más grueso que el borde principal para que se vea bien
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.stroke();

      // Luego dibujamos la línea con el gradiente
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 20; // El grosor real de la línea
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(midX, midY, x2, y2);
      ctx.stroke();
    }

    function shadeColor(color, percent) {
      let R = parseInt(color.substring(1, 3), 16);
      let G = parseInt(color.substring(3, 5), 16);
      let B = parseInt(color.substring(5, 7), 16);

      R = Math.min(255, Math.max(0, R + percent));
      G = Math.min(255, Math.max(0, G + percent));
      B = Math.min(255, Math.max(0, B + percent));

      return `rgb(${R}, ${G}, ${B})`;
    }

    function drawLabel(wire, i, yPosition) {
      ctx.fillStyle = "white";
      ctx.font = "50px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (wire.image) {
        const wireImg = new Image();
        wireImg.src = wire.image;
        ctx.drawImage(wireImg, i * WAWidth + WAWidth / 2 - 35, yPosition - 35, 70, 70);
      } else {
        ctx.fillText(wire.label, i * WAWidth + WAWidth / 2, yPosition, WAWidth);
      }
    }

    // Manejo del mouse

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (canvasWidth / rect.width);
      mouseY = (e.clientY - rect.top) * (canvasHeight / rect.height);
    });

    // Detectar cuando se inicia la conexión
    canvas.addEventListener("mousedown", () => {
      const index = Math.floor(mouseX / WAWidth);
      const tIndex = conexions.indexOf(index);
      if (mouseY > canvasHeight - WAHeight - 35) {
        if (conexions[index] !== null) {
          conexions[index] = null;
        }
        selectedWireIndex = index;
      } else if (mouseY < WAHeight + 35 && tIndex !== null && tIndex !== -1) {
        selectedWireIndex = tIndex;
        conexions[tIndex] = null;
      }
    });

    // Detectar cuando se suelta la conexión y validar si es correcta
    canvas.addEventListener("mouseup", () => {
      if (mouseY < WAHeight + 35) {
        const index = Math.floor(mouseX / WAWidth);
        const tIndex = conexions.indexOf(index);

        if (tIndex !== null && tIndex !== -1) {
          conexions[tIndex] = null;
        }
        if (selectedWireIndex !== -1) {
          conexions[selectedWireIndex] = index;
          gameCompleted = checkGameFinish();
        }
      }
      selectedWireIndex = -1;
    });

    function checkGameFinish() {
      for (let i = 0; i < conexions.length; i++) {
        if (conexions[i] === null) {
          return false;
        }
      }
      solvePuzzle(conexions);
      return true;
    }

    // Bucle de animación para actualizar la pantalla
    function loop() {
      requestAnimationFrame(loop);
      drawGame();
    }

    loop();
  }, []);

  return <canvas ref={canvasRef} id="gameCanvas" />;
};

export default FixWiringGame;
