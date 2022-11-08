import RewardBetBox from "../components/RewardBetBox"
import HeaderRewards from "../components/HeaderRewards"
import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import abiBet from "../constants/abiBet.json"

const ENDED_BET = process.env.NEXT_PUBLIC_API_URL + "getAllEndedBet/"
const ADDR_DEPLOYED_BET = process.env.NEXT_PUBLIC_API_URL + "getDeployedContracts/?return=address"

export const getServerSideProps = async () => {
    const req = await fetch(ENDED_BET)
    const dataEndedBet = await req.json()
    const req1 = await fetch(ADDR_DEPLOYED_BET)
    const addressDeployedBet = (await req1.json())["contractDeployed"]
    return { props: { dataEndedBet, addressDeployedBet } }
}

export default function Rewards({ dataEndedBet, addressDeployedBet }) {
    const [rewardsSum, setRewardsSum] = useState(0)
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis() //pull out chainId obj and rename it as chainIdHex

    return (
        <div className="min-h-screen pb-20">
            <div className="flex flex-row justify-between h-20 bg-white border-2 border-slate-300 rounded-2xl m-6 px-7">
                <div className="flex flex-col justify-center">
                    <a className="text-lg text-sky-600 font-medium">Your unclaimed rewards</a>
                    <a className="text-2xl text-black font-medium">
                        {/* {console.log("chainIdHex ", addressDeployedBet)} */}
                        {addressDeployedBet && isWeb3Enabled && parseInt(chainIdHex) == process.env.NEXT_PUBLIC_CHAINID
                            ? //addressDeployedBet.map((_addr, index) => {
                              //       return (
                              //           <div key={_addr.toString()}>
                              //               <HeaderRewards _address={_addr} />
                              //           </div>
                              //       )
                              //   })
                              "0"
                            : "0"}{" "}
                        ETH
                    </a>
                </div>
            </div>
            <div className="flex flex-wrap justify-center">
                {dataEndedBet.map((match, index) => {
                    const {
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
                    } = match
                    return (
                        <div key={match_id.toString()}>
                            <RewardBetBox
                                match_id={match_id}
                                address={address}
                                date={date}
                                away_string={away_string}
                                home_string={home_string}
                                away_logo={away_logo}
                                home_logo={home_logo}
                                away_score={away_score}
                                home_score={home_score}
                                league_string={league_string}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
