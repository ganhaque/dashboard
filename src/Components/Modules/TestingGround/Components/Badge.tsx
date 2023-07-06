import * as React from "react"
import "./Badge.css"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string; // Add className prop to the InputProps interface
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
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


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
    variant: string
  }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={ `badge ${className} ${variant}` } {...props}
    />
  )
}

export { Badge }
