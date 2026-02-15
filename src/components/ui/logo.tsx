import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
  className?: string
}

const sizes = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
}

export function Logo({ size = "md", variant = "default", className }: LogoProps) {
  const { icon, text } = sizes[size]
  const iconColor = variant === "white" ? "#FFFFFF" : "#F97316"
  const textColor = variant === "white" ? "text-white" : "text-gray-900"

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {/* Car Jack (Domkrat) Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base platform */}
        <rect x="10" y="40" width="28" height="4" rx="2" fill={iconColor} />
        {/* Vertical screw shaft */}
        <rect x="22" y="8" width="4" height="32" rx="2" fill={iconColor} />
        {/* Diamond/rhombus jack body */}
        <path
          d="M24 14L34 27L24 36L14 27L24 14Z"
          fill={iconColor}
          opacity="0.3"
        />
        <path
          d="M24 14L34 27L24 36L14 27L24 14Z"
          stroke={iconColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Top handle */}
        <rect x="16" y="4" width="16" height="4" rx="2" fill={iconColor} />
        {/* Left arm */}
        <line x1="14" y1="27" x2="8" y2="27" stroke={iconColor} strokeWidth="3" strokeLinecap="round" />
        {/* Right arm */}
        <line x1="34" y1="27" x2="40" y2="27" stroke={iconColor} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className={cn("font-bold tracking-tight", text, textColor)}>
        DOMKRAT
      </span>
    </span>
  )
}
