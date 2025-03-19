import { useEffect, useRef, useState } from "react";
import "../assets/scss/Wheel.scss";

let mouseX = 0;
let mouseY = 0;

const Wheel = ({ config, size, setResult, slices }) => {
  const canvasRef = useRef(null);
  const draggingRef = useRef(false);
  const [rotation, setRotation] = useState(0);
  const centerX = size.width / 2;
  const centerY = size.height / 2;
  const radius = Math.min(centerX, centerY) - 2;
  const angleStep = (2 * Math.PI) / slices.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = size.width;
    canvas.height = size.height;

    function drawGame() {
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, size.width, size.height);

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
        // ctx.fillStyle = slices[i].color;
        ctx.fillStyle = `hsl(${(i * 360) / slices.length}, 100%, 50%)`;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Calcular la posición del texto
        const textX = centerX + Math.cos(midAngle) * (radius * 0.87);
        const textY = centerY + Math.sin(midAngle) * (radius * 0.87);

        // Dibujar la label siempre orientada hacia el centro
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI / 2);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(slices[i].label, 0, 0);
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

      return slices[index].label;
    }

    //Calcula el angulo entre dos puntos usando el centro del canvas como punto central
    function calcularAngulo(x, y, x2, y2) {
      const angleA = Math.atan2(y - centerY, x - centerX);
      const angleB = Math.atan2(y2 - centerY, x2 - centerX);

      return angleB - angleA;
    }

    function handleMouseDown(e) {
      draggingRef.current = true;
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const prevX = mouseX;
      const prevY = mouseY;
      mouseX = (e.clientX - rect.left) * (size.width / rect.width);
      mouseY = (e.clientY - rect.top) * (size.height / rect.height);
      if (draggingRef.current) {
        // Calcular el ángulo en radianes
        const angle = calcularAngulo(prevX, prevY, mouseX, mouseY);
        // Actualizar la rotación en radianes
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
  }, [rotation]);

  return <canvas ref={canvasRef} style={{ zIndex: config.id }} />;
};

export default Wheel;
