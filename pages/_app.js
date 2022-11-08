import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import Footer from "../components/Footer"
import { NotificationProvider } from "web3uikit"

import Router from "next/router"
import NProgress from "nprogress" //nprogress module
import "nprogress/nprogress.css" //styles of nprogress

Router.events.on("routeChangeStart", () => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

function MyApp({ Component, pageProps }) {
    return (
        <div className="bg-slate-200  pb-1">
            <Head>
                <title>BoarBet</title>
                <meta name="description" content="A decentralized way to bet on your favorite teams." />
                <link rel="icon" href="/logo_simple.png" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                    <Footer />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
