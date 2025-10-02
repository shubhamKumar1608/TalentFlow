import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="TalentFlow Logo"
        className="w-8 h-8 mr-3 object-contain"
      />
      <span className="font-bold text-gray-900 text-base sm:text-lg md:text-xl">
        TalentFlow
      </span>
    </div>
  );
};

export default Logo;
