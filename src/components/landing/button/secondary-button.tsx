import { type ButtonProps } from "~/constants/interfaces";

export default function SecondaryButton({ className, children, onClick} : ButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`
        ring-1
        ring-black/50
        hover:ring-black/70
        active:ring-black/90
        font-sf 
        text-sm 
        py-1
        px-4
        rounded-2xl
        bg-white
        hover:bg-gray-50
        active:bg-gray-100
        text-gray-800
        hover:text-black
        transition-all
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