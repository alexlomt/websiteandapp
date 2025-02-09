import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  connection: number;
}

interface Config {
  particleCount: number;
  particleSize: { min: number; max: number };
  particleSpeed: { min: number; max: number };
  connectionDistance: number;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);
  const configRef = useRef<Config>({
    particleCount: Math.min(100, window.innerWidth < 768 ? 50 : 100),
    particleSize: { min: 2, max: 4 },
    particleSpeed: { min: 0.1, max: 0.3 },
    connectionDistance: 150,
    colors: {
      primary: '#10b981',   // Emerald-500
      secondary: '#059669', // Emerald-600
      background: '#1E1E1E',
    },
  });

  // Initialize particles with random positions and properties
  const initParticles = (width: number, height: number) => {
    const config = configRef.current;
    return Array.from({ length: config.particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min,
      speedX: (Math.random() - 0.5) * (config.particleSpeed.max - config.particleSpeed.min),
      speedY: (Math.random() - 0.5) * (config.particleSpeed.max - config.particleSpeed.min),
      opacity: 0.1 + Math.random() * 0.4,
      connection: 0,
    }));
  };

  // Calculate distance between two points
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Draw a single particle
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, size, opacity, connection } = particle;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    
    // Interpolate between primary and secondary colors based on connection strength
    const color1 = configRef.current.colors.primary;
    const color2 = configRef.current.colors.secondary;
    
    const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0');
    gradient.addColorStop(0, `${color1}${opacityHex}`);
    gradient.addColorStop(1, `${color2}00`);
    
    ctx.beginPath();
    ctx.arc(x, y, size * (1 + connection * 0.3), 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  // Draw connections between nearby particles
  const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const maxDistance = configRef.current.connectionDistance;
    
    for (let i = 0; i < particles.length; i++) {
      const particle1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const particle2 = particles[j];
        const distance = getDistance(particle1.x, particle1.y, particle2.x, particle2.y);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.5;
          const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.strokeStyle = `${configRef.current.colors.primary}${opacityHex}`;
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Update connection strength for glow effect
          particle1.connection = Math.max(particle1.connection, 1 - distance / maxDistance);
          particle2.connection = Math.max(particle2.connection, 1 - distance / maxDistance);
        }
      }
    }
  };

  // Update particle positions and handle mouse interaction
  const updateParticles = (width: number, height: number) => {
    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Mouse attraction
      const mouseDistance = getDistance(particle.x, particle.y, mouseRef.current.x, mouseRef.current.y);
      if (mouseDistance < 200) {
        const force = (1 - mouseDistance / 200) * 0.2;
        particle.speedX += (mouseRef.current.x - particle.x) * force * 0.01;
        particle.speedY += (mouseRef.current.y - particle.y) * force * 0.01;
      }
      
      // Boundary checking with smooth edge transition
      if (particle.x < -50) particle.x = width + 50;
      if (particle.x > width + 50) particle.x = -50;
      if (particle.y < -50) particle.y = height + 50;
      if (particle.y > height + 50) particle.y = -50;
      
      // Apply drag to prevent excessive speed
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;
      
      // Reset connection strength
      particle.connection = 0;
    });
  };

  // Main animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    
    if (!canvas || !ctx) return;
    
    // Clear canvas with semi-transparent background for trail effect
    ctx.fillStyle = `${configRef.current.colors.background}10`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    updateParticles(canvas.width, canvas.height);
    drawConnections(ctx, particlesRef.current);
    particlesRef.current.forEach(particle => drawParticle(ctx, particle));
    
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set up canvas context
    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false,
    });
    if (!ctx) return;
    contextRef.current = ctx;

    // Set up high-DPI canvas
    const dpr = Math.min(window.devicePixelRatio, 2);
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    updateCanvasSize();

    // Initialize particles
    particlesRef.current = initParticles(window.innerWidth, window.innerHeight);

    // Start animation
    animate();

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleResize = () => {
      updateCanvasSize();
      particlesRef.current = initParticles(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}