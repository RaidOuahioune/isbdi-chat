import React from 'react';

interface IsdbiLogoSvgProps {
  width?: number;
  height?: number;
  className?: string;
}

export const IsdbiLogoSvg: React.FC<IsdbiLogoSvgProps> = ({
  width = 200,
  height = 200,
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main circular logo shape */}
      <circle cx="250" cy="250" r="200" fill="#006C35" />
      <circle cx="250" cy="250" r="180" fill="white" />
      <circle cx="250" cy="250" r="160" fill="#006C35" />
      
      {/* Eight-pointed star */}
      <path
        d="M250 90 L270 170 L350 150 L290 210 L350 270 L270 250 L250 330 L230 250 L150 270 L210 210 L150 150 L230 170 L250 90Z"
        fill="white"
      />
      
      {/* Center circle */}
      <circle cx="250" cy="250" r="30" fill="white" />

      {/* Text arc around the circle - approximated */}
      <path
        id="topArc"
        d="M100,200 A150,150 0 0,1 400,200"
        fill="none"
        stroke="none"
      />
      <path
        id="bottomArc"
        d="M100,300 A150,150 0 0,0 400,300"
        fill="none"
        stroke="none"
      />
      
      <text fontSize="24" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          ISLAMIC DEVELOPMENT BANK
        </textPath>
      </text>
      
      <text fontSize="24" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold">
        <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
          البنك الإسلامي للتنمية
        </textPath>
      </text>
    </svg>
  );
};
