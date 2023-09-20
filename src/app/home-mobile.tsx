'use client'

import { MenuSideBar } from '@/components/menu-bar'
import Mktour from '@/components/ui/mktour-logo'
import { useSession } from 'next-auth/react'

export default function HomeMobile() {
	const { data: session, status, update } = useSession()
	const loading = status === 'loading'

	if (loading) return <Mktour />
	return <h1>MOBILE</h1>
}
