
import React from "react";

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function Logo({ className = "", size = 'medium' }: LogoProps) {
  const sizes = {
    small: "h-6",
    medium: "h-8",
    large: "h-12"
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center mr-2">
        <svg
          className={`${sizes[size]}`}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z"
            fill="url(#paint0_linear)"
          />
          <path
            d="M25 14H15L12 23H16L18 19H22L24 23H28L25 14Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="5"
              y1="5"
              x2="35"
              y2="35"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4079FF" />
              <stop offset="1" stopColor="#80D0C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className={`font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400 ${size === 'small' ? 'text-xl' : size === 'medium' ? 'text-2xl' : 'text-3xl'}`}>
        TripOff
      </span>
    </div>
  );
}
