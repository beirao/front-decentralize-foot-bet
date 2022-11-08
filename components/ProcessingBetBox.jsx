import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abiBet from "../constants/abiBet.json"
import Image from "next/image"
import { Typography, Loading } from "web3uikit"
import { ethers } from "ethers"

export default function Header({
    match_id,
    address,
    date,
    away_string,
    home_string,
    away_logo,
    home_logo,
    league_string,
}) {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis() //pull out chainId obj and rename it as chainIdHex
    const dateUtc = new Date(date * 1000)

    const [homeBetAmount, setHomeBetAmount] = useState()
    const [awayBetAmount, setAwayBetAmount] = useState()
    const [drawBetAmount, setDrawBetAmount] = useState()
    const [contractBalance, setContractBalance] = useState()
    const [totalHomeBetAmount, setTotalHomeBetAmount] = useState()
    const [totalAwayBetAmount, setTotalAwayBetAmount] = useState()
    const [totalDrawBetAmount, setTotalDrawBetAmount] = useState()
    const [homeOdds, setHomeOdds] = useState()
    const [awayOdds, setAwayOdds] = useState()
    const [drawOdds, setDrawOdds] = useState()

    const { runContractFunction: getAddressToAmountBetOnHome } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getAddressToAmountBetOnHome",
        params: { _fundingAddress: account },
    })
    const { runContractFunction: getAddressToAmountBetOnAway } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getAddressToAmountBetOnAway",
        params: { _fundingAddress: account },
    })
    const { runContractFunction: getAddressToAmountBetOnDraw } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getAddressToAmountBetOnDraw",
        params: { _fundingAddress: account },
    })
    const { runContractFunction: getContractBalance } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getContractBalance",
        params: {},
    })
    const { runContractFunction: getHomeBetAmount } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getHomeBetAmount",
        params: {},
    })
    const { runContractFunction: getAwayBetAmount } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getAwayBetAmount",
        params: {},
    })
    const { runContractFunction: getDrawBetAmount } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getDrawBetAmount",
        params: {},
    })

    useEffect(() => {
        updateUI()
    }, [
        account,
        isWeb3Enabled,
        contractBalance,
        totalHomeBetAmount,
        totalAwayBetAmount,
        totalDrawBetAmount,
        homeBetAmount,
        awayBetAmount,
        drawBetAmount,
        homeOdds,
        awayOdds,
        drawOdds,
    ])

    async function updateUI() {
        const homeBetAmountCall = (await getAddressToAmountBetOnHome()) || "0"
        const awayBetAmountCall = (await getAddressToAmountBetOnAway()) || "0"
        const drawBetAmountCall = (await getAddressToAmountBetOnDraw()) || "0"
        const contractBalanceCall = (await getContractBalance()) || "0"
        const totalHomeBetAmountCall = (await getHomeBetAmount()) || "0"
        const totalAwayBetAmountCall = (await getAwayBetAmount()) || "0"
        const totalDrawBetAmountCall = (await getDrawBetAmount()) || "0"

        setHomeBetAmount((homeBetAmountCall || "0").toString())
        setAwayBetAmount((awayBetAmountCall || "0").toString())
        setDrawBetAmount((drawBetAmountCall || "0").toString())
        setContractBalance((contractBalanceCall || "0").toString())
        setTotalHomeBetAmount((totalHomeBetAmountCall || "0").toString())
        setTotalAwayBetAmount((totalAwayBetAmountCall || "0").toString())
        setTotalDrawBetAmount((totalDrawBetAmountCall || "0").toString())

        setHomeOdds(totalHomeBetAmount != 0 ? contractBalance / totalHomeBetAmount : "NaN")
        setAwayOdds(totalAwayBetAmount != 0 ? contractBalance / totalAwayBetAmount : "NaN")
        setDrawOdds(totalDrawBetAmount != 0 ? contractBalance / totalDrawBetAmount : "NaN")
    }

    return (
        <div className="flex m-4">
            <div
                className="bg-white py-4 px-4 rounded-3xl"
                style={{
                    width: "370px",
                }}
            >
                <div className="relative ">
                    <div className="absolute top-0 right-0">
                        {" "}
                        <Loading size={34} spinnerColor="#2E7DAF" />
                    </div>
                </div>
                <a href={`https://goerli.etherscan.io/address/${address}`} target="_blank" className="text-2xl">
                    {league_string}
                </a>
                <br />
                <Typography variant="body18">{dateUtc.toUTCString()}</Typography>
                <div className="grid grid-cols-3 mt-5">
                    <div className="flex flex-col items-center mx-1 w-50">
                        <Image src={home_logo || ""} height="60" width="60" alt="logo home" />
                        <p className="text-center">{home_string}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-black text-2xl py-5">VS</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image src={away_logo || ""} height="60" width="60" alt="logo away" />
                        <p className="text-center">{away_string} </p>
                    </div>
                </div>
                <div className="grid grid-cols-3 mb-5">
                    <p className="text-lg text-center">{parseFloat(homeOdds).toFixed(2)}</p>
                    <p className="text-lg text-center">{parseFloat(drawOdds).toFixed(2)}</p>
                    <p className="text-lg text-center">{parseFloat(awayOdds).toFixed(2)}</p>
                </div>
                <hr />
                <div className="flex flex-row justify-between">
                    <div className="my-2">
                        <Typography variant="body18">
                            Your bets :<li>Home : {ethers.utils.formatEther(homeBetAmount || "0").toString()} ETH</li>
                            <li>Draw : {ethers.utils.formatEther(drawBetAmount || "0").toString()} ETH</li>
                            <li>Away : {ethers.utils.formatEther(awayBetAmount || "0").toString()} ETH</li>
                        </Typography>
                    </div>
                    <div className="mt-2 my-1">
                        <Typography variant="body18">
                            Volume : {ethers.utils.formatEther(contractBalance || "0")} ETH
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}
