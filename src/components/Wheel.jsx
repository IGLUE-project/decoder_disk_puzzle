import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import "../assets/scss/Wheel.scss";
import { AREACOLOR, THEMES } from "../constants/constants";
import { iconMap } from "../icons/shapesIcons";

let mouseX = 0;
let mouseY = 0;

const preloadIcons = (slices, wheelImg) => {
  const images = {};

  if (wheelImg) {
    const backgroundImg = new Image();
    backgroundImg.src = wheelImg;
    backgroundImg.onload = () => {
      images["wheelImg"] = backgroundImg;
    };
  }

  slices.forEach((slice, i) => {
    if (slice.ico && iconMap[slice.ico]) {
      let color = slice.colorIco;
      if (slice.colorIco === AREACOLOR.RAINBOW) {
        color = `hsl(${(((i + slices.length / 2) % slices.length) * 360) / slices.length}, 100%, 50%)`;
      }
      const svgString = ReactDOMServer.renderToString(iconMap[slice.ico]({ width: 24, height: 24, color }));
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        images[slice.ico + i] = img;
        URL.revokeObjectURL(url); // Liberar memoria después de la carga
      };
    }
  });

  return images;
};

const Wheel = forwardRef(({ config, size, wheel, wheelImg, theme, solved }, ref) => {
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);
  const [rotation, setRotation] = useState(0);
  const [iconImages, setIconImages] = useState(null);
  const [topPosition, setTopPosition] = useState(-1);
  const centerX = size.width / 2;
  const centerY = size.height / 2;
  const radius = Math.min(centerX, centerY) - 2;
  let slices = wheel.wheel;
  const angleStep = (2 * Math.PI) / slices.length;
  const fontSize = size.width * 0.045 + config.id * 2;
  const iconSize = size.width * 0.1;
  const labelOffset = size.width * 0.06 + config.id * 2;

  useImperativeHandle(ref, () => ({
    getResult: () => ({ id: config.id, value: topPosition }),
  }));

  useEffect(() => {
    const loadIcons = async () => {
      const images = preloadIcons(slices, wheelImg);

      // Asegurarse de que todas las imágenes se han cargado
      await Promise.all(
        Object.values(images).map(
          (img) =>
            new Promise((resolve) => {
              img.onload = resolve; // Resolvemos la promesa cuando la imagen se haya cargado
            }),
        ),
      );

      // Cuando todas las imágenes se han cargado, guardamos las imágenes
      setIconImages(images);
    };

    loadIcons();
  }, []);

  useEffect(() => {
    if (theme.moveAudio) new Audio(theme.moveAudio).play();
  }, [topPosition]);

  useEffect(() => {
    if (!iconImages) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = size.width;
    canvas.height = size.height;

    function drawGame() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, size.width, size.height);

      if (iconImages["wheelImg"]) {
        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);

        const offset = (config.id - 1) * 150;

        if (theme.repeatWheelImg) {
          ctx.drawImage(iconImages["wheelImg"], 0, 0, size.width, size.height);
        } else {
          ctx.drawImage(iconImages["wheelImg"], -offset / 2, -offset / 2, size.width + offset, size.height + offset);
        }

        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 1, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2, true);

      ctx.fill();
      ctx.closePath();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.translate(-centerX, -centerY);

      drawRoulette();
      ctx.restore();
    }

    function drawRoulette() {
      const offset = -Math.PI / slices.length;

      for (let i = 0; i < slices.length; i++) {
        const startAngle = i * angleStep + offset;
        const endAngle = (i + 1) * angleStep + offset;
        const midAngle = (startAngle + endAngle) / 2;

        // Dibujar el segmento
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        //shadow para bordes
        if (theme.name === THEMES.FUTURISTIC) {
          ctx.shadowColor = "#DE0CFF";
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 15;
        } else if (theme.name === THEMES.CONTEMPORARY) {
          ctx.shadowColor = "#2f2b4f";
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 15;
        }

        let areaColor = "#9b9b9b"; // Color por defecto

        if (wheel.areaColor) {
          if (iconImages["wheelImg"]) {
            if (wheel.areaColor === AREACOLOR.RAINBOW)
              areaColor = `hsla(${(i * 360) / slices.length}, 100%, 50%, 0.20)`;
            else if (slices[i].areaColor && slices[i].areaColor[0] === "#") areaColor = slices[i].areaColor + "33";
          } else {
            if (wheel.areaColor === AREACOLOR.RAINBOW) areaColor = `hsla(${(i * 360) / slices.length}, 100%, 50%)`;
            else if (slices[i].areaColor && slices[i].areaColor[0] === "#") areaColor = slices[i].areaColor;
          }
          ctx.fillStyle = areaColor;
          ctx.fill();
        }
        if (!iconImages["wheelImg"]) {
          ctx.fillStyle = areaColor;
          ctx.fill();
        }

        // bordes de ruedas
        if (theme.name === THEMES.CONTEMPORARY) {
          ctx.strokeStyle = "#141f40";
        } else {
          ctx.strokeStyle = "#000000";
        }
        ctx.lineWidth = 2;
        ctx.stroke();

        // bordes de división segmentos según tema:
        if (theme.name === THEMES.ANCIENT) {
          // Dibujar borde negro alrededor del área
          ctx.strokeStyle = "#222200";
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (theme.name === THEMES.FUTURISTIC) {
          // resplandor
          ctx.shadowColor = "#DE0CFF";
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 8;

          // Dibujar borde negro alrededor del área
          ctx.strokeStyle = "#F7C5FF";
          ctx.lineWidth = 3;
          ctx.stroke();
        } else if (theme.name === THEMES.CONTEMPORARY) {
          // resplandor
          ctx.shadowColor = "#2f2b4f";
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 7;

          // Dibujar borde negro alrededor del área
          ctx.strokeStyle = "#3c4e85";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        // Calcular la posición del icono o texto
        const textX = centerX + Math.cos(midAngle) * (radius - labelOffset);
        const textY = centerY + Math.sin(midAngle) * (radius - labelOffset);

        //rotación del texto/icono
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI / 2);

        // Si existe un icono pre-cargado, dibujarlo
        if (iconImages[slices[i].ico + i]) {
          ctx.drawImage(iconImages[slices[i].ico + i], -iconSize / 2, -iconSize / 2, iconSize, iconSize); // Centrado del icono
        } else {
          ctx.fillStyle = "white";
          ctx.font = `${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Medir el texto
          const text = slices[i].label;
          const padding = 3;
          const { width: textWidth } = ctx.measureText(text);

          // Dibujar fondo negro
          ctx.fillStyle = "black";
          ctx.fillRect(-textWidth / 2 - padding, -fontSize / 2 - padding, textWidth + padding * 2, fontSize + padding);

          // Dibujar texto blanco encima
          ctx.fillStyle = "white";
          ctx.fillText(text, 0, 0);
        }
        ctx.restore();
      }
      if (draggingRef.current) getTopLabel();
    }

    //obtiene el label del sector del canvas que esta en la parte superior
    function getTopLabel() {
      const adjustedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const firstSegmentAngle = -Math.PI / slices.length;
      const topAngle = ((3 * Math.PI) / 2 - adjustedRotation - firstSegmentAngle + 2 * Math.PI) % (2 * Math.PI);
      const index = Math.floor(topAngle / angleStep) % slices.length;
      if (setTopPosition !== index) {
        setTopPosition(index);
      }
    }

    //Calcula el angulo entre dos puntos usando el centro del canvas como punto central
    function calcularAngulo(x, y, x2, y2) {
      const angleA = Math.atan2(y - centerY, x - centerX);
      const angleB = Math.atan2(y2 - centerY, x2 - centerX);
      return angleB - angleA;
    }

    function handleMouseDown() {
      draggingRef.current = true;
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const prevX = mouseX;
      const prevY = mouseY;
      mouseX = (e.clientX - rect.left) * (size.width / rect.width);
      mouseY = (e.clientY - rect.top) * (size.height / rect.height);
      if (draggingRef.current) {
        const angle = calcularAngulo(prevX, prevY, mouseX, mouseY);
        setRotation((prevRotation) => prevRotation + angle);
      }
    }

    function handleMouseUp() {
      draggingRef.current = false;
    }

    function loop() {
      requestAnimationFrame(loop);
      if (!solved) drawGame();
      else clearEvents();
    }

    function clearEvents() {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    getTopLabel();
    loop();

    return () => clearEvents();
  }, [rotation, iconImages, solved, size]);

  return <canvas ref={canvasRef} style={{ zIndex: config.id }} />;
});

export default Wheel;
