import Image from 'next/image'
import Link from 'next/link'

interface PromptifyLogoProps {
  className?: string;
}

export const PromptifyLogo: React.FC<PromptifyLogoProps> = ({ className }) => {
  return (
    <Link href='/dashboard'>
      <Image height={24} width={120} src='/promptify-logo.svg' alt='logo' className={className} />
    </Link>
  )
}