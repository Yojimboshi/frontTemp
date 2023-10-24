import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ReactCardFlip from 'react-card-flip';
import useNumberofRisk from '../../components/numbergame/NumberofRisk';
import txUpdateDisplay from '../../utils/txUpdateDisplay';
import { useWallet } from '../../context/walletContext';
const Card = ({ front, back, selectedPlayerJoinedGame }) => {
    const { account, balance } = useWallet();
    const [isFlipped, setFlipped] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);
    const [roundNumber, setRoundNumber]= useState([]);
    const { playGame, getRoundBasedonGameId } = useNumberofRisk();

    useEffect(() => {

    }, []);

    const getRoundNumberfromGameId = async () =>{
        getRoundBasedonGameId
    }

    const handleCardFlip = async () => {
        if (!hasFlipped) {
            try {
                const transactionPromise = await playGame(selectedPlayerJoinedGame);
                setFlipped(true);
                setHasFlipped(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await txUpdateDisplay(transactionPromise, provider, account, updateBalance);

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
