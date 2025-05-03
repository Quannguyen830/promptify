import Image from 'next/image'
import Link from 'next/link'
import { type BaseProps } from '~/constants/interfaces';
import { useSidebar } from '~/components/ui/sidebar'

export const PromptifyLogo: React.FC<BaseProps> = ({ className }) => {
  const { state } = useSidebar()
  
  return (
    <Link className='flex items-center' href='/dashboard'>
      <Image 
        height={24} 
        width={120} 
        src='/promptify-logo.svg' 
        alt='logo' 
        className={`${className} ${state === 'collapsed' ? 'hidden' : ''}`} 
      />
    </Link>
  )
}
