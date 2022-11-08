import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abiBet from "../constants/abiBet.json"
import Image from "next/image"
import { useNotification, Button, Dropdown, Avatar, Input, Typography, Loading } from "web3uikit"
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
    const chainId = parseInt(chainIdHex) //create new var called chainId
    const dateUtc = new Date(date * 1000)
    const dispatch = useNotification()

    const [betValue, setBetValue] = useState("")
    const [betValueTemp, setBetValueTemp] = useState("")
    const [betSide, setBetSide] = useState()

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
    const [directOdds, setDirectOdds] = useState()

    const {
        runContractFunction: toBet,
        isFetching: toBet_isFetching,
        isLoading: toBet_isLoading,
    } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "toBet",
        msgValue: ethers.utils.parseEther(betValueTemp || "0"),
        params: { _betSide: betSide },
    })

    const {
        runContractFunction: cancelBet,
        isFetching: cancelBet_isFetching,
        isLoading: cancelBet_isLoading,
    } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "cancelBet",
        params: {},
    })

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
        betSide,
        betValue,
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
        directOdds,
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

        setDirectOdds(() => {
            if (betSide == 1) {
                return (
                    (parseFloat(contractBalance) + parseFloat(betValue) * 10 ** 18) /
                    (parseFloat(totalHomeBetAmount) + parseFloat(betValue) * 10 ** 18)
                ).toFixed(2)
            } else if (betSide == 2) {
                return (
                    (parseFloat(contractBalance) + parseFloat(betValue) * 10 ** 18) /
                    (parseFloat(totalAwayBetAmount) + parseFloat(betValue) * 10 ** 18)
                ).toFixed(2)
            } else if (betSide == 3) {
                return (
                    (parseFloat(contractBalance) + parseFloat(betValue) * 10 ** 18) /
                    (parseFloat(totalDrawBetAmount) + parseFloat(betValue) * 10 ** 18)
                ).toFixed(2)
            } else {
                return ""
            }
        })
    }

    function handleNewNotification() {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    async function handleSuccess(tx) {
        await tx.wait(1)
        updateUI()
        handleNewNotification(tx)
    }

    return (
        <div className="flex m-4 w-96">
            <div
                className="bg-white py-4 px-4 rounded-3xl"
                style={{
                    width: "370px",
                }}
            >
                <a href={`https://goerli.etherscan.io/address/${address}`} target="_blank" className="text-2xl">
                    {league_string}
                </a>
                <br />
                <Typography variant="body18"> {dateUtc.toUTCString()}</Typography>
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
                    <div className="flex flex-col items-end justify-start mt-2 my-1">
                        <div>
                            <Typography variant="body18">
                                Volume : {ethers.utils.formatEther(contractBalance || "0")} ETH
                            </Typography>
                        </div>
                        <div className="mt-2 my-1">
                            {(homeBetAmount > 0 || drawBetAmount > 0 || awayBetAmount > 0) &&
                            chainId == process.env.NEXT_PUBLIC_CHAINID &&
                            isWeb3Enabled ? (
                                <Button
                                    color="red"
                                    theme="colored"
                                    onClick={async function () {
                                        await cancelBet({
                                            onSuccess: handleSuccess,
                                            onError: (error) => console.log(error),
                                        })
                                    }}
                                    disabled={cancelBet_isLoading || cancelBet_isFetching}
                                    text={
                                        cancelBet_isLoading || cancelBet_isFetching ? (
                                            <Loading size={24} spinnerColor="#2E7DAF" />
                                        ) : (
                                            "Cancel all bets"
                                        )
                                    }
                                />
                            ) : (
                                <Button color="red" theme="colored" text="Cancel all bets" disabled={true} />
                            )}
                        </div>
                        <div className="mt-2 ">
                            <Typography variant="body18">
                                {directOdds && betValue && betSide ? `Multiplier x${directOdds}` : ""}
                            </Typography>
                        </div>
                    </div>
                </div>
                <Input
                    className="w-6"
                    label="ETH Amount"
                    onChange={(e) => {
                        // betValueTemp = e.target.value
                        setBetValue(e.target.value)
                    }}
                    width="isWidthAuto"
                />
                <div className="flex flex-row justify-between mb-1 my-2">
                    <div className="w-13 mr-2">
                        <Dropdown
                            label="Side : "
                            onChange={(e) => setBetSide(e.id.toString() || "0")}
                            options={[
                                {
                                    id: 3,
                                    label: "Draw",
                                    prefix: (
                                        <Avatar
                                            avatarBackground="#17752a"
                                            avatarKey={1}
                                            borderRadius={7.5}
                                            fontSize={8}
                                            size={20}
                                            text="DR"
                                            theme="letters"
                                        />
                                    ),
                                },
                                {
                                    id: 1,
                                    label: home_string,
                                    prefix: <Image src={home_logo || ""} height="20" width="20" alt="logo home" />,
                                },
                                {
                                    id: 2,
                                    label: away_string,
                                    prefix: <Image src={away_logo || ""} height="20" width="20" alt="logo away" />,
                                },
                            ]}
                            width="200px"
                        />
                    </div>
                    {address != "0x" &&
                    betSide &&
                    betValue > 0 &&
                    chainId == process.env.NEXT_PUBLIC_CHAINID &&
                    isWeb3Enabled ? (
                        <Button
                            isFullWidth
                            theme="primary"
                            onClick={async function () {
                                setBetValueTemp(betValue)
                                await toBet({
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }}
                            disabled={toBet_isLoading || toBet_isFetching}
                            text={
                                toBet_isLoading || toBet_isFetching ? (
                                    <Loading size={12} spinnerColor="#2E7DAF" spinnerType="wave" />
                                ) : (
                                    "Bet"
                                )
                            }
                        />
                    ) : (
                        <Button isFullWidth text="Bet" theme="primary" disabled={true} />
                    )}
                </div>
            </div>
        </div>
    )
}
