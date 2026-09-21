import React, { useEffect, useState, useRef } from 'react';

export default function CyberCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });

      // Check if hovering interactive element
      const target = e.target;
      const interactive = target && (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button'
      );
      setIsHovered(!!interactive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth trailing spring loop
    const followLoop = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      setTrailingPos({ x: Math.round(currentX), y: Math.round(currentY) });
      animId = requestAnimationFrame(followLoop);
    };
    animId = requestAnimationFrame(followLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouchDevice || !enabled || position.x < 0) return null;

  return (
    <>
      {/* 1. Pinpoint Laser Reticle */}
      <div
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        <div className={`h-2 w-2 rounded-full ${isClicked ? 'bg-rose-400 scale-150' : 'bg-cyan-400'} shadow-[0_0_10px_#38bdf8]`} />
      </div>

      {/* 2. Trailing Cyber Bracket HUD with Live Telemetry */}
      <div
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
        }}
      >
        <div
          className={`relative transition-all duration-200 ${
            isHovered
              ? 'w-10 h-10 border-2 border-cyan-400/80 rounded-lg scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
              : 'w-7 h-7 border border-violet-400/50 rounded-full scale-100'
          }`}
        >
          {/* Corner Crosshair Ticks */}
          {isHovered && (
            <>
              <div className="absolute -top-1.5 -left-1.5 w-1.5 h-1.5 border-t-2 border-l-2 border-cyan-300" />
              <div className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-300" />
              <div className="absolute -bottom-1.5 -left-1.5 w-1.5 h-1.5 border-b-2 border-l-2 border-cyan-300" />
              <div className="absolute -bottom-1.5 -right-1.5 w-1.5 h-1.5 border-b-2 border-r-2 border-cyan-300" />
            </>
          )}

          {/* Real-time Sub-pixel HUD Tag */}
          <div className="absolute left-8 -top-3 px-1.5 py-0.5 rounded bg-black/85 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 whitespace-nowrap shadow-md select-none opacity-80 backdrop-blur-sm">
            {isHovered ? 'LOCK' : `X:${position.x} Y:${position.y}`}
          </div>
        </div>
      </div>
    </>
  );
}

