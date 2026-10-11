import React from 'react';

interface TraceLogoProps {
  className?: string;
  size?: number | string;
}

export const TraceLogo: React.FC<TraceLogoProps> = ({ 
  className = "w-12 h-12", 
  size 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`} 
      style={style}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          {/* Card background gradient */}
          <linearGradient id="traceBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a192f" />
            <stop offset="60%" stopColor="#0b1329" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Border rim gradient */}
          <linearGradient id="traceBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.7" />
          </linearGradient>

          {/* Futuristic T Emblem Gradient */}
          <linearGradient id="traceTGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* T Bevel Highlight */}
          <linearGradient id="traceTBevel" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="traceOuterGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cyan orbit glow */}
          <filter id="orbitGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Rounded-Square Container */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="22"
          fill="url(#traceBg)"
          stroke="url(#traceBorder)"
          strokeWidth="2.5"
          filter="url(#traceOuterGlow)"
        />

        {/* Background ambient lighting ellipse */}
        <ellipse cx="48" cy="50" rx="32" ry="24" fill="#0284c7" opacity="0.15" />

        {/* Orbital Ring - Back Segment (Behind the Stem) */}
        <path
          d="M20 72 C16 75, 24 79, 44 75 C64 71, 82 61, 80 56 C79 53, 72 52, 60 55"
          stroke="#06b6d4"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Faceted Futuristic "T" Emblem */}
        {/* Top Bar of T */}
        <path
          d="M24 30 L74 30 L70 38 L28 38 Z"
          fill="url(#traceTGradient)"
        />
        {/* Top Bar Bevel Light */}
        <path
          d="M24 30 L74 30 L72 33 L26 33 Z"
          fill="url(#traceTBevel)"
        />

        {/* Vertical Center Stem (Faceted Diamond/Chevron Angle) */}
        {/* Left facet */}
        <path
          d="M44 38 L50 38 L50 78 L42 78 Z"
          fill="#0284c7"
        />
        {/* Main angular facet tapering to a futuristic point */}
        <path
          d="M48 38 L62 38 L52 82 L46 82 Z"
          fill="url(#traceTGradient)"
        />
        {/* Highlight ridge on stem */}
        <path
          d="M48 38 L51 38 L47 82 L46 82 Z"
          fill="#ffffff"
          opacity="0.6"
        />

        {/* Orbital Ring - Front Segment (Crosses in Front of Stem) */}
        <path
          d="M20 72 C28 66, 52 57, 76 56 C80 56, 82 58, 80 60 C76 64, 52 74, 28 80 C22 81, 18 78, 20 72 Z"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.2"
          filter="url(#orbitGlow)"
        />

        {/* 4-Point Sparkle Star (Top Right of T) */}
        <path
          d="M80 34 L82 39 L87 41 L82 43 L80 48 L78 43 L73 41 L78 39 Z"
          fill="#67e8f9"
          filter="url(#orbitGlow)"
        />
        <circle cx="80" cy="41" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
};
