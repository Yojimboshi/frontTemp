import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import useNumberofRisk from '../../components/numbergame/NumberofRisk';
const Card = ({ front, back,selectedPlayerJoinedGame}) => {
    const [isFlipped, setFlipped] = useState(false);
    const [hasFlipped, setHasFlipped] = useState(false);
    const { playGame } = useNumberofRisk();

    const handleCardFlip =async  () => {
        if (!hasFlipped) {
            try{
                console.log("asdasd")
                const transactionPromise = await playGame(0, selectedPlayerJoinedGame);

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await txUpdateDisplay(transactionPromise, provider, account, updateBalance);
                setFlipped(true);
                setHasFlipped(true);
            }catch(error){
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
