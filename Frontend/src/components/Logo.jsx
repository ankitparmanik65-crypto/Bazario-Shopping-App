function Logo({ size = 40, showText = true, variant = 'gradient' }) {
  const isGradient = variant === 'gradient';

  return (
    <div className="logo-wrapper">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon"
      >
        <defs>
          <linearGradient
            id="bazarioGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#f7931e" />
          </linearGradient>
        </defs>

        {/* Bag Body */}
        <path
          d="M13 14 L11 42 Q11 45 14 45 L34 45 Q37 45 37 42 L35 14 Z"
          fill={isGradient ? 'url(#bazarioGrad)' : '#ff6b35'}
        />

        {/* Handle */}
        <path
          d="M17 14 Q17 6 24 6 Q31 6 31 14"
          stroke={isGradient ? 'url(#bazarioGrad)' : '#ff6b35'}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* "B" Letter */}
        <text
          x="24"
          y="36"
          fontSize="20"
          fontWeight="900"
          fill="white"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
        >
          B
        </text>
      </svg>

      {showText && <span className="logo-text">Bazario</span>}
    </div>
  );
}

export default Logo;