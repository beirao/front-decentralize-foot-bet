import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abiBet from "../constants/abiBet.json"

export default function HeaderRewards({ _address }) {
    const [betSum, setBetSum] = useState(0)
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis() //pull out chainId obj and rename it as chainIdHex

    const { runContractFunction: getReward } = useWeb3Contract({
        abi: abiBet,
        contractAddress: _address,
        functionName: "getReward",
        params: { addr: account },
    })
    return { reward: getReward() }
}
