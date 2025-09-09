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
  const gameEndedRef = useRef(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [topPosition, setTopPosition] = useState(0);
  const [iconImages, setIconImages] = useState(null);
  const idSize = config.id + 4 - theme.wheels.length;
  const centerX = size.width / 2;
  const centerY = size.height / 2;
  const radius = Math.min(centerX, centerY) - 2;
  const slices = wheel.wheel;
  const rotation = useRef(-Math.PI / 2); // Inicia la rotación para que el primer segmento esté arriba
  const angleStep = (2 * Math.PI) / slices.length;
  const fontSize = size.width * 0.045 + idSize * 1.5;
  const iconSize = size.width * 0.08 + idSize * 2;
  let labelOffset = size.width * 0.045 + Math.pow(idSize, 1.3) * size.width * 0.009;
  let iconOffset = size.width * 0.04 + Math.pow(idSize, 1.3) * size.width * 0.009;
  if (idSize === 4) {
    labelOffset = size.width * 0.06 + idSize * size.width * 0.015;
    iconOffset = size.width * 0.06 + idSize * size.width * 0.0135;
  }

  useImperativeHandle(ref, () => ({
    getResult: () => ({ id: config.id, value: topPosition }),
    setSolution: (solution) => endAnimation(solution),
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
    if (theme.moveAudio && !firstLoad) new Audio(theme.moveAudio).play();
    else setFirstLoad(false);
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
        ctx.rotate(rotation.current);
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
      ctx.rotate(rotation.current);
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
        if (theme.skin === THEMES.FUTURISTIC) {
          ctx.shadowColor = "#DE0CFF";
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 15;
        } else if (theme.skin === THEMES.BASIC) {
          ctx.shadowColor = "#2f2b4f";
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 15;
        }

        let areaColor = "#9b9b9b"; // Color por defecto

        if (wheel.areaColor || slices[i].areaColor) {
          if (iconImages["wheelImg"]) {
            if (slices[i].areaColor) {
              areaColor = withOpacity(slices[i].areaColor, 0.6);
            }
          } else {
            if (slices[i].areaColor) {
              areaColor = withOpacity(slices[i].areaColor, 1);
            }
          }

          ctx.fillStyle = areaColor;
          ctx.fill();
        }

        if (!iconImages["wheelImg"]) {
          ctx.fillStyle = areaColor;
          ctx.fill();
        }

        // bordes de ruedas
        if (theme.skin === THEMES.BASIC) {
          ctx.strokeStyle = "#141f40";
        } else {
          ctx.strokeStyle = "#000000";
        }
        ctx.lineWidth = 2;
        ctx.stroke();

        // bordes de división segmentos según tema:
        if (theme.skin === THEMES.RETRO) {
          // Dibujar borde negro alrededor del área
          ctx.strokeStyle = "#222200";
          ctx.lineWidth = 4;
          ctx.stroke();
        } else if (theme.skin === THEMES.FUTURISTIC) {
          // resplandor
          ctx.shadowColor = "#DE0CFF";
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 8;

          // Dibujar borde negro alrededor del área
          ctx.strokeStyle = "#F7C5FF";
          ctx.lineWidth = 3;
          ctx.stroke();
        } else if (theme.skin === THEMES.BASIC) {
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
        ctx.save();

        // Si existe un icono pre-cargado, dibujarlo
        if (iconImages[slices[i].ico + i]) {
          const iconX = centerX + Math.cos(midAngle) * (radius - iconOffset);
          const iconY = centerY + Math.sin(midAngle) * (radius - iconOffset);

          //rotación del texto/icono
          ctx.translate(iconX, iconY);
          ctx.rotate(midAngle + Math.PI / 2);

          ctx.drawImage(iconImages[slices[i].ico + i], -iconSize / 2, -iconSize / 2, iconSize, iconSize); // Centrado del icono
        } else if (slices[i].label) {
          const textX = centerX + Math.cos(midAngle) * (radius - labelOffset);
          const textY = centerY + Math.sin(midAngle) * (radius - labelOffset);

          //rotación del texto/icono
          ctx.translate(textX, textY);
          ctx.rotate(midAngle + Math.PI / 2);

          ctx.fillStyle = "black";
          ctx.font = `${fontSize}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const text = slices[i].label;

          if (iconImages["wheelImg"]) {
            // Medir el texto
            const padding = 6;
            const { width: textWidth } = ctx.measureText(text);

            // Dibujar fondo negro
            ctx.fillStyle = "black";
            ctx.fillRect(
              -textWidth / 2 - padding,
              -fontSize / 2 - padding,
              textWidth + padding * 2,
              fontSize + padding,
            );
            // Dibujar texto blanco encima
            ctx.fillStyle = "white";
          }

          ctx.fillText(text, 0, 0);
        }
        ctx.restore();
      }
      if (draggingRef.current) getTopLabel();
    }

    function withOpacity(color, opacity = 0.2) {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = color;
      const computed = ctx.fillStyle; // Convierte el color al formato válido
      if (computed.startsWith("rgb")) {
        return computed.replace("rgb", "rgba").replace(")", `, ${opacity})`);
      }
      return (
        computed +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0")
      ); // Para hex
    }

    //obtiene el label del sector del canvas que esta en la parte superior
    function getTopLabel() {
      const adjustedRotation = ((rotation.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const firstSegmentAngle = -Math.PI / slices.length;
      const topAngle = ((3 * Math.PI) / 2 - adjustedRotation - firstSegmentAngle + 2 * Math.PI) % (2 * Math.PI);
      const index = Math.floor(topAngle / angleStep) % slices.length;

      setTopPosition(index);
    }

    //Calcula el angulo entre dos puntos usando el centro del canvas como punto central
    function calcularAngulo(x, y, x2, y2) {
      const angleA = Math.atan2(y - centerY, x - centerX);
      const angleB = Math.atan2(y2 - centerY, x2 - centerX);
      return angleB - angleA;
    }

    function handleMouseDown(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (size.width / rect.width);
      mouseY = (e.clientY - rect.top) * (size.height / rect.height);
      draggingRef.current = true;
    }

    function handleMouseMove(e) {
      if (!draggingRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const prevX = mouseX;
      const prevY = mouseY;

      mouseX = (e.clientX - rect.left) * (size.width / rect.width);
      mouseY = (e.clientY - rect.top) * (size.height / rect.height);

      const angle = calcularAngulo(prevX, prevY, mouseX, mouseY);

      if (!isNaN(angle) && isFinite(angle)) {
        rotation.current += angle;
      }
    }

    function handleMouseUp() {
      draggingRef.current = false;
    }

    function loop() {
      requestAnimationFrame(loop);
      drawGame();
      if (solved) clearEvents();
    }

    function clearEvents() {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    getTopLabel();
    loop();

    return () => clearEvents();
  }, [iconImages, solved, size]);

  // Calcula la rotación necesaria para que el segmento quede arriba
  function getRotationForTopLabel(index) {
    const offset = -Math.PI / slices.length;
    const segmentAngle = (index + 0.5) * angleStep + offset;
    // Queremos que ese ángulo esté en la posición de la flecha (3π/2)
    return (3 * Math.PI) / 2 - segmentAngle;
  }

  function normalizeAngle(angle) {
    return ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  }

  //Calcula el camino mas corto entre dos angulos para evitar vueltas innecesarias
  function shortestAngleDifference(from, to) {
    const a = normalizeAngle(from);
    const b = normalizeAngle(to);
    let diff = b - a;

    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;

    return diff;
  }
  const endPoint = useRef(false);
  function endAnimation(_endPoint) {
    const angletopPosition = getRotationForTopLabel(_endPoint);
    let diff = shortestAngleDifference(rotation.current, angletopPosition);
    if (idSize % 2 === 0) {
      diff += Math.PI * 2; // Ajuste para que el segmento quede centrado
    } else {
      diff -= Math.PI * 2; // Ajuste para que el segmento quede centrado
    }
    endPoint.current = diff;
    endGameAnimation(_endPoint);
  }

  //Animación de fin de juego que cuadra la rueda en el punto superior correcto
  function endGameAnimation(_endPoint) {
    if (Math.abs(endPoint.current) > 0.01) {
      rotation.current += Math.sign(endPoint.current) * Math.min(0.07, Math.abs(endPoint.current));
    } else {
      if (!gameEndedRef.current) {
        gameEndedRef.current = true;
      }
      // rotation.current = angletopPosition;
      rotation.current = getRotationForTopLabel(_endPoint);
    }

    if (!gameEndedRef.current) {
      setTimeout(() => {
        endPoint.current -= Math.sign(endPoint.current) * Math.min(0.07, Math.abs(endPoint.current));
        endGameAnimation(_endPoint);
      }, 15);
    }
  }

  return <canvas ref={canvasRef} style={{ zIndex: config.id }} />;
});

export default Wheel;
