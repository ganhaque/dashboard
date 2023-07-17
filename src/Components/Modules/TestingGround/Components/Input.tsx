import * as React from "react"
import "./Input.css"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string; // Add className prop to the InputProps interface
    label?: string;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`input-style-default ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

