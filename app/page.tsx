import Link from "next/link"
import { Button } from "@/components/ui/button"
import "@/app/globals.css"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl mt-16 mb-24 text-center">
        <h1 className="text-5xl font-bold mb-6">THE DEFI WAY TO EARN ON CRYPTO</h1>
        <p className="text-xl text-gray-300 mb-8">
          Yearn is DeFi&apos;s longest running, most battle tested, and most trusted yield protocol.
        </p>
        <div className="flex justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/strategies">DISCOVER STRATEGIES</Link>
          </Button>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-12 w-full text-center">THERE ARE LOADS OF WAYS TO EARN, WITH YEARN!</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-[#0A1029] p-8 rounded-lg border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">STRATEGIES PUT YOUR CRYPTO TO WORK, SO YOU DON&apos;T HAVE TO.</h3>
          <p className="text-gray-300">
            The DeFi economy offers loads of way to earn yield on your capital. Yearn Strategies automatically take
            advantage of these opportunities to give you the best risk adjusted yields without you having to lift a
            finger.
          </p>
        </div>
        <div className="bg-[#0A1029] p-8 rounded-lg border border-gray-800">
          <h3 className="text-2xl font-bold mb-4">YEARN APPS.</h3>
          <p className="text-gray-300">Apps built on Yearn strategies by contributors and the wider community!</p>
        </div>
      </div>
    </div>
  )
}

