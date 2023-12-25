
import { turboPascal } from "@/app/fonts"

export default function MktourNavbar() {
	return (
		<h1 className={`${turboPascal.className} text-2xl font-bold m-auto select-none`}>
			<span className='group'>
				mktour<span className='group-hover:animate-logo-pulse'>_</span>
			</span>
		</h1>
	)
}
