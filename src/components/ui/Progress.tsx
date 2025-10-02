import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-slate-200",
  {
    variants: {
      variant: {
        default: "bg-slate-200",
        success: "bg-green-200",
        warning: "bg-yellow-200",
        error: "bg-red-200",
        info: "bg-blue-200",
      },
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const progressBarVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-blue-600",
        success: "bg-gradient-to-r from-green-500 to-green-600",
        warning: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        error: "bg-gradient-to-r from-red-500 to-red-600",
        info: "bg-gradient-to-r from-cyan-500 to-cyan-600",
        gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number;
  max?: number;
  showValue?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    variant, 
    size, 
    value, 
    max = 100, 
    showValue = false, 
    animated = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="w-full">
        {showValue && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm font-medium text-slate-700">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(progressVariants({ variant, size }), className)}
          {...props}
        >
          <div
            className={cn(
              progressBarVariants({ variant }),
              animated && "animate-pulse"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress, progressVariants, progressBarVariants };
