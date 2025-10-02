import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700",
        destructive:
          "cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700",
        outline:
          "cursor-pointer border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg hover:shadow-xl hover:bg-slate-50 hover:border-slate-400",
        secondary:
          "cursor-pointer bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 shadow-lg hover:shadow-xl hover:from-slate-200 hover:to-slate-300",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        gradient:
          "cursor-pointer bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        xl: "h-14 rounded-2xl px-10 has-[>svg]:px-8 text-lg",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
