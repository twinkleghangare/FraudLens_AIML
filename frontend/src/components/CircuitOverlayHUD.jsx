import React from 'react';

export default function CircuitOverlayHUD() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden select-none">
      <svg
        className="w-full h-full max-w-[580px] max-h-[500px]"
        viewBox="0 0 700 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Bold Futuristic Chamfered Emblem (Left - 1:1 Match to Reference) */}
        <g className="opacity-90">
          {/* Outer Chamfered Polygon */}
          <path
            d="M90 260 L130 220 L210 220 L210 250 L195 250 L195 275 L210 275 L210 320 L170 320 L150 285 L125 285 L125 320 L90 320 Z"
            fill="white"
          />
          {/* Inner Negative Cutout */}
          <path
            d="M125 252 L145 238 L175 238 L175 265 L150 265 L140 275 L125 275 Z"
            fill="#030306"
          />
        </g>

        {/* 2. Hairline Cyber Circuit Traces & Right-Angle Bends (Exact Match to Reference) */}
        <g stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="miter" className="opacity-80">
          
          {/* Main Horizontal Run from Emblem with 90° and 45° step-downs */}
          <path
            d="M225 290 L270 290 L270 260 L330 260 L350 290 L400 290"
            fill="none"
          />

          {/* Secondary Circuit Branch */}
          <path
            d="M300 260 L300 320 L340 320"
            fill="none"
            strokeOpacity="0.6"
          />

          {/* Diagonal 45° Intercept Line */}
          <path
            d="M365 320 L385 290 L490 290"
            fill="none"
          />

          {/* Micro Terminal Dots */}
          <circle cx="270" cy="260" r="2.5" fill="white" />
          <circle cx="350" cy="290" r="2.5" fill="white" />
          <circle cx="385" cy="290" r="2.5" fill="white" />
          <circle cx="490" cy="290" r="2.5" fill="white" />

          {/* Downward Hook */}
          <path
            d="M490 290 L490 320"
            fill="none"
          />
        </g>

        {/* 3. Bold Dashed Terminal Blocks (Right - Exact Match to Reference) */}
        <g fill="white" className="opacity-90">
          {/* Segment 1 */}
          <rect x="510" y="306" width="32" height="13" rx="1.5" />
          {/* Segment 2 */}
          <rect x="615" y="306" width="32" height="13" rx="1.5" />
        </g>

        {/* Subtle Ambient Telemetry Grid Marker */}
        <g opacity="0.35" stroke="white" strokeWidth="0.75">
          <line x1="225" y1="230" x2="225" y2="350" strokeDasharray="2 4" />
          <line x1="490" y1="230" x2="490" y2="350" strokeDasharray="2 4" />
        </g>
      </svg>
    </div>
  );
}

