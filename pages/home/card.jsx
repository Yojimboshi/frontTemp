import React, {useState } from 'react';
import { ethers } from 'ethers';
import ReactCardFlip from 'react-card-flip';
import useNumberofRisk from '../../components/numbergame/NumberofRisk';
import txUpdateDisplay from '../../utils/txUpdateDisplay';
import { useWallet } from '../../context/walletContext';
const Card = ({ front, back, selectedPlayerJoinedGame,onRoundAndRewardsChange }) => {
    const numberGameHooks = useNumberofRisk();
    const { getRoundBasedonGameId } = numberGameHooks;
    const { account, balance } = useWallet();
    const [isFlipped, setFlipped] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);
    const { playGame } = useNumberofRisk();

    const handleCardFlip = async () => {
        if (!hasFlipped) {
            try {
                const tempRoundandRewards = await getRoundBasedonGameId();
                onRoundAndRewardsChange(tempRoundandRewards);
                const transactionPromise = await playGame(selectedPlayerJoinedGame);
                const receipt = await transactionPromise.wait();

                setFlipped(true);
                setHasFlipped(true);

                onCardDataUpdate(updatedCardData);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await txUpdateDisplay(receipt, provider, account);
            } catch (error) {
                console.log(error);
            }

        }
    };

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
