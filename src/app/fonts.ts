import localFont from "next/font/local"
import { Azeret_Mono } from "next/font/google"

export const turboPascal = localFont({
	src: './fonts/TurboPascalFont.ttf',
	display: 'swap',
})
 
 
export const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  display: 'swap',
})