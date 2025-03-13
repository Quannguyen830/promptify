import Image from 'next/image'
import Link from 'next/link'
import { type BaseProps } from '~/constants/interfaces';


export const PromptifyLogo: React.FC<BaseProps> = ({ className }) => {
  return (
    <Link className='flex items-center' href='/dashboard'>
      <Image height={24} width={120} src='/promptify-logo.svg' alt='logo' className={className} />
    </Link>
  )
}