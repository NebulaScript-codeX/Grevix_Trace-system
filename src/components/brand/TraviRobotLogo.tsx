import React from 'react';

interface TraviRobotLogoProps {
  className?: string;
  size?: number | string;
}

export const TraviRobotLogo: React.FC<TraviRobotLogoProps> = ({ 
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
          <linearGradient id="traviBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#2e1065" />
          </linearGradient>

          {/* Border rim gradient */}
          <linearGradient id="traviBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
          </linearGradient>

          {/* Robot head gradient */}
          <linearGradient id="traviHead" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Eye glow filter */}
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Outer glow filter */}
          <filter id="avatarGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer Rounded-Square Container */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="22"
          fill="url(#traviBg)"
          stroke="url(#traviBorder)"
          strokeWidth="2.5"
          filter="url(#avatarGlow)"
        />

        {/* Background Sparkles */}
        <path
          d="M20 18L21.5 22.5L26 24L21.5 25.5L20 30L18.5 25.5L14 24L18.5 22.5Z"
          fill="#c084fc"
          opacity="0.8"
        />
        <path
          d="M80 72L81 75L84 76L81 77L80 80L79 77L76 76L79 75Z"
          fill="#38bdf8"
          opacity="0.85"
        />

        {/* Antenna */}
        {/* Antenna Stem */}
        <rect x="48.5" y="15" width="3" height="12" rx="1.5" fill="#94a3b8" />
        {/* Antenna Ball */}
        <circle cx="50" cy="14" r="5" fill="#e2e8f0" />
        <circle cx="48.5" cy="12.5" r="1.5" fill="#ffffff" />
        <circle cx="50" cy="14" r="5.5" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />

        {/* Robot Body / Shoulders */}
        <path
          d="M28 85 C28 72, 38 68, 50 68 C62 68, 72 72, 72 85 Z"
          fill="#cbd5e1"
        />
        <path
          d="M38 72 C42 77, 58 77, 62 72 Z"
          fill="#0f172a"
        />
        {/* Glowing chest ring */}
        <ellipse cx="50" cy="74" rx="4" ry="2.5" fill="#38bdf8" filter="url(#cyanGlow)" />

        {/* Robot Ear Pods (Left & Right Headphones) */}
        {/* Left Ear */}
        <ellipse cx="23" cy="46" rx="4.5" ry="8" fill="#94a3b8" />
        <ellipse cx="23" cy="46" rx="3" ry="6" fill="#0284c7" filter="url(#cyanGlow)" />
        {/* Right Ear */}
        <ellipse cx="77" cy="46" rx="4.5" ry="8" fill="#94a3b8" />
        <ellipse cx="77" cy="46" rx="3" ry="6" fill="#0284c7" filter="url(#cyanGlow)" />

        {/* Robot Head Outer Shape */}
        <rect
          x="25"
          y="26"
          width="50"
          height="40"
          rx="18"
          fill="url(#traviHead)"
          stroke="#f8fafc"
          strokeWidth="1.2"
        />

        {/* Visor Screen (Glossy Dark Glass) */}
        <rect
          x="31"
          y="32"
          width="38"
          height="28"
          rx="11"
          fill="#090d16"
          stroke="#1e293b"
          strokeWidth="1"
        />

        {/* Visor reflection highlight */}
        <path
          d="M34 35 C42 33, 58 33, 66 35 C64 38, 55 38, 34 35 Z"
          fill="#ffffff"
          opacity="0.18"
        />

        {/* Expressive Happy Cyan Glowing Eyes (^ ^ shaped cute smiling arcs) */}
        {/* Left Eye Arc */}
        <path
          d="M38 46 C40.5 41, 44.5 41, 47 46"
          stroke="#38bdf8"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
          filter="url(#cyanGlow)"
        />
        {/* Right Eye Arc */}
        <path
          d="M53 46 C55.5 41, 59.5 41, 62 46"
          stroke="#38bdf8"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
          filter="url(#cyanGlow)"
        />

        {/* Soft Cheek Blush */}
        <circle cx="36" cy="51" r="2" fill="#c084fc" opacity="0.6" />
        <circle cx="64" cy="51" r="2" fill="#c084fc" opacity="0.6" />
      </svg>
    </div>
  );
};
