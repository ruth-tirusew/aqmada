import Image from 'next/image'
import Link from 'next/link'
import error from "@/public/404.svg"
 
export default function NotFound() {
  return (
<div className="h-screen w-screen flex items-center align-center justify-center bg-white text-black">
        <div className="grid grid-cols-1 gap-4">
        <Image src={error} alt="404" />
        <h1 className="text-2xl font-bold text-center mt-4">Oops! We couldn&apos;t find the page you were looking for.</h1>
        <Link href={"/"} className="border-2 border-[#0B965A] text-[#0B965A] text-center rounded-md font-semibold px-10 py-2 hover:bg-[#0B965A]/[5%]" >Back to home</Link>

        </div>
</div>
  )
}