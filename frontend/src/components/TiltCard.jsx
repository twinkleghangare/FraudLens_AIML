import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({ children, className = '', glowColor = 'rgba(168, 85, 247, 0.25)', onClick }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -12; // tilt angle
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
        transition: 'transform 0.15s ease-out',
      }}
      className={`relative overflow-hidden cursor-pointer ${className}`}
    >
      {/* Dynamic Specular Glare Follower */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-[inherit]"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 80%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

