import Image from 'next/image'
import Link from 'next/link'
import error403 from "@/public/403.svg"
 
export default function NotFound() {
  return (
<div className="h-screen flex items-center align-center justify-center text-black">
        <div className="grid grid-cols-1 gap-4">
        <Image src={error403} alt="403" />
        <Link href={"/"} className="border-2 border-[#003949] text-[#003949] text-center rounded-md font-semibold px-10 py-2 hover:bg-[#003949]/[5%]" >Back to home</Link>

        </div>
</div>
  )
}