import { type BaseProps } from "~/constants/interfaces";
import PrimaryButton from "./button/primary-button";
import SecondaryButton from "./button/secondary-button";
import Image from "next/image";

export default function Navbar({ className } : BaseProps) {
  return (
    <nav className={`flex justify-between p-4 ${className}`}>
      <Image height={24} width={120} src='/promptify-logo.svg' alt='logo' className={className} />
      
      {/* routing */}
      <div className="flex h-full justify-center gap-2">
        <PrimaryButton className="w-40">
          <p>Join our waitlist</p>
        </PrimaryButton>

        <SecondaryButton className="w-40">
          <p>Contact us</p>
        </SecondaryButton>
      </div>
    </nav>
  )
}