import * as React from "react";
import "./Badge.css";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  color?: string;
  backgroundColor?: string;
  style?: React.CSSProperties; // New prop to allow additional styles
}

function Badge({
  className,
  variant,
  color,
  backgroundColor,
  style, // Include the style prop here
  ...props
}: BadgeProps) {
  return (
    <div
      style={{
        backgroundColor: variant ? "" : `hsla(var(--${backgroundColor}))`,
        color: variant ? "" : `hsla(var(--${color}))`,
        ...style,
      }}
      className={`badge ${className} ${variant}`}
      {...props}
    />
  );
}

export { Badge };

