import Image from 'next/image'
import Link from 'next/link'

export const PromptifyLogo = () => {
  return (
    <Link href='/dashboard'>
      <Image height={24} width={120} src='/promptify-logo.svg' alt='logo' />
    </Link>
  )
}