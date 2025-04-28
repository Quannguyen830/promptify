import { type ButtonProps } from "~/constants/interfaces";

export default function PrimaryButton({ className, children, onClick } : ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-40
        h-8
        bg-[#0F62FE] 
        hover:bg-[#0C56E0] 
        active:bg-[#0A4BC7]
        rounded-2xl 
        text-white 
        font-sf 
        text-sm 
        py-1 
        px-4 
        transition-colors 
        duration-200 
        ease-in-out
        shadow-sm
        hover:shadow-md
        ${className}
      `}
    >
      {children}
    </button>
  )
}