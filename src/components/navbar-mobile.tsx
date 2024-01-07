'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navbarItems } from '@/constants'
import { NavbarItem } from '@/types/next-auth'
import { motion, useCycle } from 'framer-motion'
import ModeToggler from './mode-toggler'
import { signIn, signOut, useSession } from 'next-auth/react'
import MktourNavbar from './ui/mktour-logo-navbar'

const sidebar = {
	open: (height = 1000) => ({
		clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
		transition: {
			type: 'spring',
			stiffness: 20,
			restDelta: 2,
		},
	}),
	closed: {
		clipPath: 'circle(0px at 100% 0)',
		transition: {
			type: 'spring',
			stiffness: 400,
			damping: 40,
		},
	},
}

export default function NavbarMobile() {
	const pathname = usePathname()
	const containerRef = useRef(null)
	const { height } = useDimensions(containerRef)
	const [isOpen, toggleOpen] = useCycle(false, true)
	const { data: session, status, update } = useSession()

	return (
		<nav className='z-50 flex flex-row min-w-max w-full border-b items-center justify-start p-4 fixed gap-3 bg-background/95'>
			<div>
				<Link href='/'>
					<MktourNavbar />
				</Link>
			</div>
			<div className='flex-grow'></div>
			<motion.nav
				initial={false}
				animate={isOpen ? 'open' : 'closed'}
				custom={height}
				className={`fixed inset-0 z-50 w-full md:hidden ${isOpen ? '' : 'pointer-events-none'}`}
				ref={containerRef}
			>
				<motion.div className='absolute inset-0 right-0 w-full bg-secondary' variants={sidebar} />
				<motion.ul variants={variants} className='absolute grid w-full gap-3 px-10 py-16'>
					{navbarItems.map((item, idx) => {
						const isLastItem = idx === navbarItems.length - 1 // Check if it's the last item
						const isAction = item.type === 'action'

						return (
							<div key={idx}>
								{isAction ? (
									<MenuItem>
										<button
											onClick={() => {
												toggleOpen()
												item.action()
											}}
											className={`flex w-full text-2xl`}
											name='menu'
										>
											{item.title}
										</button>
									</MenuItem>
								) : (
									<MenuItem>
										<Link
											href={item.path}
											onClick={() => toggleOpen()}
											className={`flex w-full text-2xl ${
												item.path === pathname ? 'font-bold' : ''
											}`}
										>
											{item.title}
										</Link>
									</MenuItem>
								)}
								<MenuItem className='my-3 h-px w-full bg-gray-300' />
							</div>
						)
					})}
					<MenuItem>
						{status === 'unauthenticated' || status === 'loading' ? (
							<button
								className='text-xl'
								name='sign in with lichess'
								onClick={() => signIn('lichess', { redirect: false })}
							>
								sign in with lichess
							</button>
						) : (
							<button className='flex w-full text-xl' name='log out' onClick={() => signOut()}>
								log out
							</button>
						)}
					</MenuItem>
					<MenuItem>
						<ModeToggler variant='mobile' />
					</MenuItem>
				</motion.ul>
				<MenuToggle toggle={toggleOpen} />
			</motion.nav>
		</nav>
	)
}

const MenuToggle = ({ toggle }: { toggle: any }) => (
	<button
		onClick={toggle}
		className='pointer-events-auto absolute p-1 right-4 top-4 z-30 text-foreground'
	>
		<svg width='24' height='24' viewBox='0 0 23 23'>
			<Path
				variants={{
					closed: { d: 'M 2 2.5 L 20 2.5' },
					open: { d: 'M 3 16.5 L 17 2.5' },
				}}
			/>
			<Path
				d='M 2 9.423 L 20 9.423'
				variants={{
					closed: { opacity: 1 },
					open: { opacity: 0 },
				}}
				transition={{ duration: 0.1 }}
			/>
			<Path
				variants={{
					closed: { d: 'M 2 16.346 L 20 16.346' },
					open: { d: 'M 3 2.5 L 17 16.346' },
				}}
			/>
		</svg>
	</button>
)

const Path = (props: any) => (
	<motion.path
		className='fill-primary stroke-primary'
		strokeWidth='3'
		strokeLinecap='round'
		{...props}
	/>
)

const MenuItem = ({ className, children }: { className?: string; children?: ReactNode }) => {
	return (
		<motion.li variants={MenuItemVariants} className={className}>
			{children}
		</motion.li>
	)
}

const MenuItemVariants = {
	open: {
		y: 0,
		opacity: 1,
		transition: {
			y: { stiffness: 1000, velocity: -100 },
		},
	},
	closed: {
		y: 50,
		opacity: 0,
		transition: {
			y: { stiffness: 1000 },
			duration: 0.02,
		},
	},
}

const variants = {
	open: {
		transition: { staggerChildren: 0.02, delayChildren: 0.15 },
	},
	closed: {
		transition: { staggerChildren: 0.01, staggerDirection: -1 },
	},
}

const useDimensions = (ref: any) => {
	const dimensions = useRef({ width: 0, height: 0 })

	useEffect(() => {
		if (ref.current) {
			dimensions.current.width = ref.current.offsetWidth
			dimensions.current.height = ref.current.offsetHeight
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref])

	return dimensions.current
}
