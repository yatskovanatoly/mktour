import ThemeProvider from '@/components/theme-provider'
import { PropsWithChildren } from 'react'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import Navbar from '@/components/navbar'

export const metadata = {
	title: 'mktour',
	description: 'an app for organazing complex tournament brackets of all kind',
}

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider attribute="class" disableTransitionOnChange>
					<Navbar />
					{children}
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
