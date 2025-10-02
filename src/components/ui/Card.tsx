import React from "react";
import type { CardProps } from "../../types";
import { cn } from "../../lib/utils";

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  variant = "default",
  hover = false,
}) => {
  const baseStyles = "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 transition-all duration-300";

  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const variantStyles = {
    default: "bg-white/80",
    glass: "bg-white/10 backdrop-blur-md border-white/20",
    gradient: "bg-gradient-to-br from-white to-slate-50",
    elevated: "bg-white shadow-2xl border-slate-200",
  };

  const hoverStyles = hover 
    ? "hover:shadow-xl hover:scale-105 cursor-pointer" 
    : "";

  const cardClassName = cn(
    baseStyles,
    paddingStyles[padding],
    variantStyles[variant],
    hoverStyles,
    className
  );

  return <div className={cardClassName}>{children}</div>;
};

export default Card;
