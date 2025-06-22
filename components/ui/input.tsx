"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue)
    }, [props.value, props.defaultValue])

    return (
      <div className="relative w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]">{leftIcon}</div>
          )}

          <input
            type={inputType}
            className={cn(
              "w-full px-4 py-3 bg-[#E8F8F5] border border-transparent rounded-2xl text-[#2C3E50] placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#1DD1A1] focus:border-transparent transition-all duration-200",
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              error && "ring-2 ring-[#E74C3C] bg-red-50",
              className,
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            {...props}
          />

          {label && (
            <label
              className={cn(
                "absolute left-4 transition-all duration-200 pointer-events-none",
                isFocused || hasValue
                  ? "top-2 text-xs text-[#1DD1A1] font-medium"
                  : "top-1/2 transform -translate-y-1/2 text-[#7F8C8D]",
                leftIcon && (isFocused || hasValue ? "left-4" : "left-10"),
              )}
            >
              {label}
            </label>
          )}

          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7F8C8D] hover:text-[#2C3E50] transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}

          {rightIcon && !isPassword && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7F8C8D]">{rightIcon}</div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-[#E74C3C] ml-1">{error}</p>}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
