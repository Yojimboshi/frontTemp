import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import numberGameAbi from '../../data/abi/numberGameAbi.json';
import { numberGameAddress } from '../../config/setting';
import { useWallet } from '../../context/walletContext';


export default function useNumberGame() {
    const { account, balance } = useWallet();
    const [contract, setContract] = useState(null);
    useEffect(() => {
        if (window.ethereum && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const createdContract = new ethers.Contract(numberGameAddress, numberGameAbi, signer);
            setContract(createdContract);
        } else {
            console.error('MetaMask extension not found or account not connected.');
        }
    }, [account]);

    const joinGame = (entryBet, gameid) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return null;
        }
        const valueToSend = ethers.utils.parseEther(entryBet);
        return contract.joinGame(gameid, { value: valueToSend, gasLimit: 160000 });
    };

    const guess = (betValue, playerGuess, gameid) => {
        const valueToSend = ethers.utils.parseEther(betValue);
        return contract.makeGuess(gameid, playerGuess, { value: valueToSend, gasLimit: 160000 });
    };

    const withdraw = (gameid) => {
        return contract.withdraw(gameid, { gasLimit: 100000 });
    };

    const createGame = (entryBet) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return null;
        }
        const valueToSend = ethers.utils.parseEther(entryBet);
        return contract.createGame({ value: valueToSend, gasLimit: 1000000 });
    }


    const availableGame = async () => {
        let activeCount = 0;
        const nextGameId = await contract.nextGameId();
        var activeGameIds = [];
        for (let i = 1; i < nextGameId; i++) {
            const gameAfterCreation = await contract.games(i);
            if (gameAfterCreation.currentState == 1 && (gameAfterCreation.player1.toLowerCase() != account && gameAfterCreation.player2.toLowerCase() != account)) {
                const minimumBet = ethers.utils.formatEther(gameAfterCreation.minimumBet);
                activeGameIds[activeGameIds.length] = [i, minimumBet];
                activeCount++;
            }
        }
        return activeGameIds;
    }

    const availableGameBasedOnPlayerAddress = async () => {
        let activeCount = 0;
        const nextGameId = await contract.nextGameId();
        var activeGameIds = [];
        for (let i = 1; i < nextGameId; i++) {
            const gameAfterCreation = await contract.games(i);
            if ((gameAfterCreation.player1.toLowerCase() == account || gameAfterCreation.player2.toLowerCase() == account)
                && gameAfterCreation.currentState != 4) {
                const minimumBet = ethers.utils.formatEther(gameAfterCreation.minimumBet);
                let player1 = gameAfterCreation.player1;
                let player2 = gameAfterCreation.player2;
                player1 = player1.substring(0,4) + "..." +player1.substring(player1.length - 3);
                player2 = player2.substring(0,4) + "..." +player2.substring(player2.length - 3);
                activeGameIds[activeGameIds.length] = [i, minimumBet, player1, player2];
                activeCount++;
            }
        }
        return activeGameIds;
    }

    return { joinGame, guess, withdraw, createGame, availableGame, availableGameBasedOnPlayerAddress, };
}