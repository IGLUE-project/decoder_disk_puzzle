import { useEffect, useRef, useState } from "react";
import { iconMap } from "../icons/shapesIcons";
import "../assets/scss/Wheel.scss";
import ReactDOMServer from "react-dom/server";
import { AREACOLOR } from "../constants/constants";

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

const Wheel = ({ config, size, setResult, wheel, wheelImg }) => {
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);
  const [rotation, setRotation] = useState(0);
  const [iconImages, setIconImages] = useState(null);
  const centerX = size.width / 2;
  const centerY = size.height / 2;
  const radius = Math.min(centerX, centerY) - 2;
  let slices = wheel.wheel;
  const angleStep = (2 * Math.PI) / slices.length;

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
  }, [slices]);

  useEffect(() => {
    if (!iconImages) return; // Asegurarse de que los iconos estén cargados antes de renderizar

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = size.width;
    canvas.height = size.height;

    function drawGame() {
      ctx.clearRect(0, 0, size.width, size.height);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, size.width, size.height);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radius - 20, 0, Math.PI * 2, true);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();

      if (iconImages["wheelImg"]) {
        ctx.save();

        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);

        //TODO: decidir si dividir imagen o repetir anillos
        // ctx.drawImage(iconImages["wheelImg"], 5, 5, size.width - 10, size.height - 10);
        const offset = (config.id - 1) * 150;
        ctx.drawImage(iconImages["wheelImg"], -offset / 2, -offset / 2, size.width + offset, size.height + offset);

        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2, true);
      ctx.fillStyle = "black";
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
      const offset = -Math.PI / slices.length; // Ajuste para centrar un quesito arriba

      for (let i = 0; i < slices.length; i++) {
        const startAngle = i * angleStep + offset;
        const endAngle = (i + 1) * angleStep + offset;
        const midAngle = (startAngle + endAngle) / 2;

        // Dibujar el segmento
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

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

        // Dibujar borde negro alrededor del área
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Calcular la posición del icono o texto
        const textX = centerX + Math.cos(midAngle) * (radius - 37.5);
        const textY = centerY + Math.sin(midAngle) * (radius - 37.5);

        //rotación del texto/icono
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI / 2);

        // Si existe un icono pre-cargado, dibujarlo
        if (iconImages[slices[i].ico + i]) {
          ctx.drawImage(iconImages[slices[i].ico + i], -20, -20, 40, 40); // Centrado del icono
        } else {
          ctx.fillStyle = "white";
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          ctx.strokeText(slices[i].label, 0, 0);
          ctx.fillText(slices[i].label, 0, 0);
        }
        ctx.restore();

        setResult(getTopLabel(), config.id);
      }
    }

    //obtiene el label del sector del canvas que esta en la parte superior
    function getTopLabel() {
      const adjustedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const firstSegmentAngle = -Math.PI / slices.length;
      const topAngle = ((3 * Math.PI) / 2 - adjustedRotation - firstSegmentAngle + 2 * Math.PI) % (2 * Math.PI);
      const index = Math.floor(topAngle / angleStep) % slices.length;

      return index;
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

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    function loop() {
      requestAnimationFrame(loop);
      drawGame();
    }

    loop();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [rotation, iconImages]);

  return <canvas ref={canvasRef} style={{ zIndex: config.id }} />;
};

export default Wheel;
