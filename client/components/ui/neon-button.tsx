import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const neonButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-cyber-surface border-glow-cyan text-cyber-cyan hover:bg-cyber-surface-hover hover:glow-cyan",
        destructive:
          "bg-cyber-surface border border-red-500 text-red-400 hover:bg-red-950/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]",
        outline:
          "border border-cyber-cyan/50 bg-transparent text-cyber-cyan hover:border-cyber-cyan hover:glow-cyan",
        secondary:
          "bg-cyber-surface border-glow-purple text-cyber-purple hover:bg-cyber-surface-hover hover:glow-purple",
        ghost:
          "text-cyber-cyan hover:bg-cyber-surface/50 hover:text-cyber-cyan",
        link: "text-cyber-cyan underline-offset-4 hover:underline text-glow-cyan",
        scan: "bg-gradient-to-r from-cyber-purple to-cyber-cyan text-white font-bold border-0 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(96,165,250,0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neonButtonVariants> {
  asChild?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(neonButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {variant === "scan" && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </Comp>
    );
  },
);
NeonButton.displayName = "NeonButton";

export { NeonButton, neonButtonVariants };
