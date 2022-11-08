import { ConnectButton } from "web3uikit"
import Link from "next/link"
import Image from "next/image"
import ScrollToTop from "./ScrollToTop"

export default function Header() {
    return (
        <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-4">
            <div class="flex items-center flex-shrink-0 text-white mr-6">
                <Image src="/logo_simple.svg" className="mr-3 h-6 sm:h-12" width="45" height="45" alt="BoarBet Logo" />
                <span class="font-semibold text-xl tracking-tight">
                    <p className="text-2xl text-teal-900 ml-2 mr-9">BoarBet</p>
                </span>
            </div>
            <div class="block lg:hidden">
                <button class="flex items-center px-3 py-2 ">
                    <ConnectButton moralisAuth={false} />
                </button>
            </div>

            <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div class="text-sm lg:flex-grow">
                    <Link
                        href="/"
                        className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-16"
                    >
                        Home
                    </Link>
                    <Link
                        href="/rewards"
                        className="block mt-4 text-base lg:inline-block lg:mt-0 text-teal-200 hover:text-white "
                    >
                        Rewards
                    </Link>
                </div>
            </div>
            <div className="hidden lg:block mr-3">
                <ConnectButton moralisAuth={false} />
            </div>
            <ScrollToTop />
        </nav>
    )
}
