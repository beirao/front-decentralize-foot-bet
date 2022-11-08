import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abiBet from "../constants/abiBet.json"
import Image from "next/image"
import { useNotification, Button, Typography, Loading } from "web3uikit"
import { ethers } from "ethers"

export default function Header({
    match_id,
    address,
    date,
    away_string,
    home_string,
    away_logo,
    home_logo,
    away_score,
    home_score,
    league_string,
}) {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis() //pull out chainId obj and rename it as chainIdHex
    const chainId = parseInt(chainIdHex) //create new var called chainId
    const dateUtc = new Date(date * 1000)
    const dispatch = useNotification()

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
    const [rewardValue, setRewardValue] = useState()

    const {
        runContractFunction: withdrawReward,
        isFetching: withdrawReward_isFetching,
        isLoading: withdrawReward_isLoading,
    } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "withdrawReward",
        params: {},
    })
    const { runContractFunction: getReward } = useWeb3Contract({
        abi: abiBet,
        contractAddress: address,
        functionName: "getReward",
        params: { addr: account },
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
        const rewardValueCall = (await getReward()) || ""

        setHomeBetAmount((homeBetAmountCall || "0").toString())
        setAwayBetAmount((awayBetAmountCall || "0").toString())
        setDrawBetAmount((drawBetAmountCall || "0").toString())
        setContractBalance((contractBalanceCall || "0").toString())
        setTotalHomeBetAmount((totalHomeBetAmountCall || "0").toString())
        setTotalAwayBetAmount((totalAwayBetAmountCall || "0").toString())
        setTotalDrawBetAmount((totalDrawBetAmountCall || "0").toString())
        setRewardValue((rewardValueCall || "0").toString())

        setHomeOdds(
            totalHomeBetAmount != 0
                ? (parseInt(totalHomeBetAmount) + parseInt(totalAwayBetAmount) + parseInt(totalDrawBetAmount)) /
                      totalHomeBetAmount
                : "NaN"
        )
        setAwayOdds(
            totalAwayBetAmount != 0
                ? (parseInt(totalHomeBetAmount) + parseInt(totalAwayBetAmount) + parseInt(totalDrawBetAmount)) /
                      totalAwayBetAmount
                : "NaN"
        )
        setDrawOdds(
            totalDrawBetAmount != 0
                ? (parseInt(totalHomeBetAmount) + parseInt(totalAwayBetAmount) + parseInt(totalDrawBetAmount)) /
                      totalDrawBetAmount
                : "NaN"
        )
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

    // Probably could add some error handling
    async function handleSuccess(tx) {
        await tx.wait(1)
        updateUI()
        handleNewNotification(tx)
    }

    if (rewardValue > 0) {
        return (
            <div className="flex m-4">
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
                    <div className="grid grid-cols-3 mb-5 text-center">
                        <p className="text-3xl">{home_score}</p>
                        <p className="text-2xl"> ━ </p>
                        <p className="text-3xl">{away_score}</p>

                        <p className="text-lg">{parseFloat(homeOdds).toFixed(2)}</p>
                        <p className="text-lg">{parseFloat(drawOdds).toFixed(2)}</p>
                        <p className="text-lg">{parseFloat(awayOdds).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col justify-between items-center">
                        {address != "0x" && rewardValue > 0 && isWeb3Enabled ? (
                            <Button
                                isFullWidth
                                theme="primary"
                                onClick={async function () {
                                    await withdrawReward({
                                        onSuccess: handleSuccess,
                                        onError: (error) => console.log(error),
                                    })
                                }}
                                size={withdrawReward_isLoading || withdrawReward_isFetching ? "large" : "small"}
                                disabled={withdrawReward_isLoading || withdrawReward_isFetching}
                                text={
                                    withdrawReward_isLoading || withdrawReward_isFetching ? (
                                        <Loading size={12} spinnerColor="#2E7DAF" spinnerType="wave" />
                                    ) : (
                                        `Withdraw ${ethers.utils.formatEther(rewardValue || "0")} ETH`
                                    )
                                }
                            />
                        ) : (
                            <Button
                                isFullWidth
                                text={`Withdraw ${ethers.utils.formatEther(rewardValue || "0")} ETH`}
                                theme="primary"
                                size="small"
                                disabled={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
