'use client'

// Disclaimer:
// I am not the author of this code, I have only modified it to work with my project.
// I took heavy inspiration from Marcel Elias (dromzeh) code and modified it to be a reusable component.
// https://github.com/dromzeh/dromzeh.dev/blob/main/src/components/main/contact.tsx

import React from 'react'
import { AnimatePresence, motion, MotionConfig, Variants, type Transition } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const transition: Transition = { type: 'spring', bounce: 0.3, duration: 0.3 }

type ContextType = {
  status: string
  setStatus: React.Dispatch<React.SetStateAction<string>>
}

const Context = React.createContext<ContextType>({
  status: '',
  setStatus: () => null,
})

type SocialLinkProps = {
  href: string
  name: string
  icon: string
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, name, icon }) => {
  const ctx = React.useContext<ContextType>(Context)

  const iconVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 15,
      translateX: "-50%",
      filter: "blur(3px)",
      rotate: "0deg",
  },
  show: (custom: { rotateRight: boolean }) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      rotate: custom?.rotateRight ? "6deg" : "-3deg",
  }),
  exit: {
      opacity: 0,
      y: 15,
      filter: "blur(3px)",
      rotate: "0deg",
      transition: { ...transition, duration: 0.5 },
  },
};

  return (
    <Link
      href={href}
      onMouseOver={() => ctx.setStatus(name)}
      onMouseOut={() => ctx.setStatus('idle')}
      className="relative transition-colors text-grey-500 duration-300 ease-out hover:text-grey-900 dark:text-grey-300 dark:hover:text-grey-100 group-hover:text-muted-foreground dark:group-hover:text-muted"
    >
      <AnimatePresence>
        {ctx.status === name && (
          <motion.div
            variants={iconVariants}
            custom={{ rotateRight: Math.random() > 0.5 }}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute -top-12 left-1/2 w-10 h-10 -translate-x-1/2 rotate-3 overflow-hidden rounded-lg shadow-md"
          >
            <Image 
              src={icon} 
              width={64} 
              height={64} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="inline-flex items-center gap-1">
        <ArrowUpRight size={20} />
        {name}
      </span>
    </Link>
  )
}

type SocialLinksProps = {
  links: SocialLinkProps[]
}

export default function SocialLinks({ links }: SocialLinksProps) {
  const [status, setStatus] = React.useState('idle')

  React.useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setStatus('idle')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [setStatus])

  return (
    <Context.Provider value={{ status, setStatus }}>
      <MotionConfig transition={transition}>
        <div className="group flex items-center gap-4 text-muted-foreground dark:text-muted">
          {links.map((link) => (
            <SocialLink key={link.name} {...link} />
          ))}
        </div>
      </MotionConfig>
    </Context.Provider>
  )
}