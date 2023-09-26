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
            console.log(account);
            setContract(createdContract);
        } else {
            console.error('MetaMask extension not found or account not connected.');
        }
    }, [account]);

    const joinGame = (entryBet,gameid) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return null;
        }
        const valueToSend = ethers.utils.parseEther(entryBet);
        return contract.joinGame(gameid,{ value: valueToSend, gasLimit: 100000 });
    };

    const guess = (betValue, playerGuess,gameid) => {
        const valueToSend = ethers.utils.parseEther(betValue);
        return contract.makeGuess(gameid,playerGuess, { value: valueToSend, gasLimit: 120000 });
    };

    const withdraw = (gameid) => {
        return contract.withdraw(gameid,{ gasLimit: 100000 });
    };


    const availableGame = async () => {
        let activeCount = 0;
        const nextGameId = await contract.nextGameId();
        var activeGameIds = [];
        for (let i = 1; i < nextGameId; i++) {
            const gameAfterCreation = await contract.games(i);
            if (gameAfterCreation.currentState == 1) {
                activeGameIds[activeGameIds.length] = i;
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
                activeGameIds[activeGameIds.length] = i;
                activeCount++;
            }
        }
        console.log(activeGameIds)
        return activeGameIds;
    }


    const getNextGameId = () => {
        return contract.nextGameId();
    }
    return { joinGame, guess, withdraw, availableGame, availableGameBasedOnPlayerAddress, getNextGameId };
}