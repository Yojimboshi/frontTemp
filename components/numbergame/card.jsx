import React, { useState } from 'react';
import { ethers } from 'ethers';
import ReactCardFlip from 'react-card-flip';
import useNumberofRisk from './CardGameOfRisks';
import txUpdateDisplay from '../../utils/txUpdateDisplay';
import { useWallet } from '../../context/walletContext';
import { toast } from 'react-toastify';
const Card = ({ front, back, cardIndex, selectedPlayerJoinedGame, cardsData, settingCardsData }) => {
    const numberGameHooks = useNumberofRisk();
    const { getRoundBasedonGameId } = numberGameHooks;
    const { account, balance } = useWallet();
    const [isFlipped, setFlipped] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);
    const { playGame } = useNumberofRisk();

    const handleCardFlip = async () => {
        if (!hasFlipped) {
            try {
                setHasFlipped(true);
                const transactionPromise = await playGame(selectedPlayerJoinedGame);
                const receipt = await transactionPromise.wait(); // get receipt

                const tempRoundandRewards = await getRoundBasedonGameId();
                const rewardsBasedonGameId = checkRewardfromGameId(tempRoundandRewards, selectedPlayerJoinedGame)
                const updatedCardsData = [...cardsData];
                updatedCardsData[cardIndex].back = rewardsBasedonGameId;
                settingCardsData(updatedCardsData);

                setFlipped(true);

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await txUpdateDisplay(receipt, provider, account);

                setTimeout(() => {
                    setFlipped(false);
                    setHasFlipped(false);
                }, 10000);

            } catch (error) {
                if (error.code === "ACTION_REJECTED") {
                    setHasFlipped(false);
                    toast.error("Transaction canceled");
                } else {
                    // Handle other errors
                    setHasFlipped(false);
                    toast.error("Error Playing game");
                }
            }
        }
    };

    const checkRewardfromGameId = (tempRoundandRewards, selectedPlayerJoinedGame) => {
        for (let i = 0; i < tempRoundandRewards.length; i++) {
            if (tempRoundandRewards[i][2] == selectedPlayerJoinedGame) {
                const rewardsBasedonGameId = tempRoundandRewards[i][1];
                const winMessage = "You won: " + rewardsBasedonGameId + "ETH"
                return winMessage;
            }
        }
        const loseMessage = "You Lost"
        return loseMessage;
    }

    return (
        <div className="card" onClick={handleCardFlip}>
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <div key="front" className="card-front">
                    <h2>{front}</h2>
                </div>
                <div key="back" className="card-back">
                    <p>{back}</p>
                </div>
            </ReactCardFlip>
        </div>
    );
};

export default Card;
