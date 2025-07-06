import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Advanced particle system for quantum-like effects
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export default function QuantumShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Advanced transforms based on mouse position
  const rotateX = useTransform(mouseY, [0, dimensions.height], [5, -5]);
  const rotateY = useTransform(mouseX, [0, dimensions.width], [-5, 5]);
  const scale = useTransform(mouseX, [0, dimensions.width], [0.95, 1.05]);

  // Quantum-inspired color palette
  const quantumColors = [
    "rgba(0, 255, 255, 0.8)", // Cyan
    "rgba(255, 0, 255, 0.8)", // Magenta
    "rgba(255, 255, 0, 0.8)", // Yellow
    "rgba(128, 0, 255, 0.8)", // Purple
    "rgba(0, 255, 128, 0.8)", // Green
  ];

  // Initialize particles with quantum behavior
  useEffect(() => {
    const initParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 150; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 200,
          color:
            quantumColors[Math.floor(Math.random() * quantumColors.length)],
          size: 1 + Math.random() * 3,
        });
      }
      setParticles(newParticles);
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles();
    }
  }, [dimensions]);

  // Advanced particle animation with quantum field effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(15, 20, 25, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles((prev) =>
        prev
          .map((particle) => {
            // Quantum tunneling effect - particles can randomly jump
            if (Math.random() < 0.001) {
              return {
                ...particle,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
              };
            }

            // Wave function collapse simulation
            const waveInfluence = Math.sin(particle.life * 0.1) * 0.5;

            // Update position with quantum uncertainty
            const newX = particle.x + particle.vx + waveInfluence;
            const newY =
              particle.y + particle.vy + Math.sin(particle.life * 0.05) * 0.3;

            // Boundary conditions with wrapping
            const wrappedX =
              newX < 0 ? canvas.width : newX > canvas.width ? 0 : newX;
            const wrappedY =
              newY < 0 ? canvas.height : newY > canvas.height ? 0 : newY;

            // Quantum entanglement - particles influence each other
            let entanglementForceX = 0;
            let entanglementForceY = 0;

            // Draw particle with quantum glow
            ctx.save();
            ctx.globalAlpha = Math.max(
              0.1,
              1 - particle.life / particle.maxLife,
            );

            // Quantum superposition - particle exists in multiple states
            for (let i = 0; i < 3; i++) {
              const offsetX = Math.sin(particle.life * 0.1 + i) * 2;
              const offsetY = Math.cos(particle.life * 0.1 + i) * 2;

              ctx.beginPath();
              ctx.arc(
                particle.x + offsetX,
                particle.y + offsetY,
                particle.size * (1 - i * 0.3),
                0,
                Math.PI * 2,
              );
              ctx.fillStyle = particle.color;
              ctx.fill();

              // Quantum field glow
              ctx.shadowBlur = 20;
              ctx.shadowColor = particle.color;
              ctx.fill();
            }

            ctx.restore();

            return {
              ...particle,
              x: wrappedX,
              y: wrappedY,
              life: particle.life + 1,
              vx: particle.vx + entanglementForceX * 0.01,
              vy: particle.vy + entanglementForceY * 0.01,
            };
          })
          .filter((particle) => particle.life < particle.maxLife),
      );

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particles, dimensions]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    >
      {/* Quantum field canvas */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Advanced holographic grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
          background: `
            radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.03) 50%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.03) 50%, transparent 51%)
          `,
          backgroundSize: "100px 100px, 120px 120px, 20px 20px, 20px 20px",
        }}
      />

      {/* Quantum interference patterns */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg, 
              rgba(0, 255, 255, 0.05) 60deg, 
              transparent 120deg, 
              rgba(255, 0, 255, 0.05) 180deg, 
              transparent 240deg, 
              rgba(255, 255, 0, 0.05) 300deg, 
              transparent 360deg)
          `,
          animation: "spin 20s linear infinite",
        }}
      />

      {/* Advanced corner quantum gates */}
      {[
        { top: "2rem", left: "2rem", rotation: 0 },
        { top: "2rem", right: "2rem", rotation: 90 },
        { bottom: "2rem", left: "2rem", rotation: 270 },
        { bottom: "2rem", right: "2rem", rotation: 180 },
      ].map((corner, index) => (
        <motion.div
          key={index}
          className="absolute w-20 h-20"
          style={corner}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.1, 1],
            rotate: corner.rotation + 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut",
          }}
        >
          {/* Quantum gate visualization */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 border-2 border-cyan-400/40 transform rotate-45" />
            <div className="absolute inset-2 border border-magenta-400/40 transform -rotate-45" />
            <div className="absolute inset-4 bg-gradient-to-br from-cyan-400/20 to-magenta-400/20 rounded-full animate-pulse" />
          </div>
        </motion.div>
      ))}

      {/* Quantum entanglement visualization */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient
            id="quantumGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(0, 255, 255, 0.4)">
              <animate
                attributeName="stop-color"
                values="rgba(0,255,255,0.4);rgba(255,0,255,0.4);rgba(255,255,0,0.4);rgba(0,255,255,0.4)"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="rgba(255, 0, 255, 0.2)">
              <animate
                attributeName="stop-color"
                values="rgba(255,0,255,0.2);rgba(255,255,0,0.2);rgba(0,255,255,0.2);rgba(255,0,255,0.2)"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="rgba(255, 255, 0, 0.1)">
              <animate
                attributeName="stop-color"
                values="rgba(255,255,0,0.1);rgba(0,255,255,0.1);rgba(255,0,255,0.1);rgba(255,255,0,0.1)"
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* Quantum field lines */}
        <path
          d="M 0 200 Q 200 100 400 200 T 800 200 Q 1000 150 1200 200"
          stroke="url(#quantumGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            values="M 0 200 Q 200 100 400 200 T 800 200 Q 1000 150 1200 200;
                    M 0 250 Q 200 150 400 250 T 800 250 Q 1000 200 1200 250;
                    M 0 200 Q 200 100 400 200 T 800 200 Q 1000 150 1200 200"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M 0 400 Q 300 300 600 400 T 1200 400"
          stroke="url(#quantumGradient)"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        >
          <animate
            attributeName="d"
            values="M 0 400 Q 300 300 600 400 T 1200 400;
                    M 0 450 Q 300 350 600 450 T 1200 450;
                    M 0 400 Q 300 300 600 400 T 1200 400"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
