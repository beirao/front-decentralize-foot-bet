import ActiveBetBox from "../components/ActiveBetBox"
import ProcessingBetBox from "../components/ProcessingBetBox"
import EndedBetBox from "../components/EndedBetBox"
import { Tab, TabList } from "web3uikit"

const ACTIVE_BET = process.env.NEXT_PUBLIC_API_URL + "getAllActiveBet/"
const PROCESSING_BET = process.env.NEXT_PUBLIC_API_URL + "getAllProcessingBet/"
const ENDED_BET = process.env.NEXT_PUBLIC_API_URL + "getAllRecentEndedBet/"

export const getServerSideProps = async () => {
    const req1 = await fetch(ACTIVE_BET)
    const dataActiveBet = await req1.json()
    const req2 = await fetch(PROCESSING_BET)
    const dataProcessingBet = await req2.json()
    const req3 = await fetch(ENDED_BET)
    const dataEndedBet = await req3.json()
    return { props: { dataActiveBet, dataProcessingBet, dataEndedBet } }
}

export default function Home({ dataActiveBet, dataProcessingBet, dataEndedBet }) {
    return (
        <div className="min-h-screen mx-10 mt-4 mb-20 ">
            <TabList defaultActiveKey={1} tabStyle="bar">
                <Tab tabKey={1} tabName="Active Bets">
                    <div className="flex flex-wrap justify-evenly">
                        {dataActiveBet.map((match, index) => {
                            const {
                                match_id,
                                address,
                                date,
                                away_string,
                                home_string,
                                away_logo,
                                home_logo,
                                league_string,
                            } = match
                            return (
                                <div key={match_id.toString()}>
                                    <ActiveBetBox
                                        match_id={match_id}
                                        address={address}
                                        date={date}
                                        away_string={away_string}
                                        home_string={home_string}
                                        away_logo={away_logo}
                                        home_logo={home_logo}
                                        league_string={league_string}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </Tab>
                <Tab tabKey={2} tabName="Processing Bets">
                    <div className="flex flex-wrap justify-evenly">
                        {dataProcessingBet.map((match, index) => {
                            const {
                                match_id,
                                address,
                                date,
                                away_string,
                                home_string,
                                away_logo,
                                home_logo,
                                league_string,
                            } = match
                            return (
                                <div key={match_id.toString()}>
                                    <ProcessingBetBox
                                        match_id={match_id}
                                        address={address}
                                        date={date}
                                        away_string={away_string}
                                        home_string={home_string}
                                        away_logo={away_logo}
                                        home_logo={home_logo}
                                        league_string={league_string}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </Tab>
                <Tab tabKey={3} tabName="Ended Bets">
                    <div className="flex flex-wrap  justify-evenly">
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
                                    <EndedBetBox
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
                </Tab>
            </TabList>
        </div>
    )
}
