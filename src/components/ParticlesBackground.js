import React, { useEffect, useRef } from "react";

const CANTIDAD_PARTICULAS = 90;

/**
 * Fondo animado con partículas grises que flotan lentamente.
 */
const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Sin soporte de canvas (p. ej. en los tests) no se dibuja nada
    if (!ctx) return undefined;
    // Respeta la preferencia del sistema de reducir animaciones
    const reducirMovimiento = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let particulas = [];
    let animacion;

    const crearParticulas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particulas = Array.from({ length: CANTIDAD_PARTICULAS }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radio: Math.random() * 6 + 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    };

    const dibujar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(90, 90, 90, 0.8)";

      particulas.forEach((p) => {
        if (!reducirMovimiento) {
          p.x = (p.x + p.vx + canvas.width) % canvas.width;
          p.y = (p.y + p.vy + canvas.height) % canvas.height;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!reducirMovimiento) animacion = requestAnimationFrame(dibujar);
    };

    const handleResize = () => {
      crearParticulas();
      if (reducirMovimiento) dibujar();
    };

    crearParticulas();
    dibujar();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animacion);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-background" aria-hidden="true" />;
};

export default ParticlesBackground;
