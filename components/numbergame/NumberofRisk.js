import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import numberofRiskAbi from '../../data/abi/numberofRiskabi.json';
import { numberofRiskAddress } from '../../config/setting';
import { useWallet } from '../../context/walletContext';


export default function useNumberofRisk() {
    const { account, balance } = useWallet();
    const [contract, setContract] = useState(null);
    useEffect(() => {
        if (window.ethereum && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const createdContract = new ethers.Contract(numberofRiskAddress, numberofRiskAbi, signer);
            setContract(createdContract);
        } else {
            console.error('MetaMask extension not found or account not connected.');
        }
    }, [account]);

    const withdraw = (gameid) => {
        return contract.withdraw(gameid, { gasLimit: 100000 });
    };

    const playGame = (gameid) => {
        return contract.playGame(gameid, { gasLimit: 100000 });
    };

    const createGame = (entryBet) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return null;
        }
        const valueToSend = ethers.utils.parseEther(entryBet);
        return contract.createGame({ value: valueToSend, gasLimit: 1000000 });
    }


    const availableGameBasedOnPlayerAddress = async () => {
        let activeCount = 0;
        const nextGameId = await contract.nextGameId();
        var activeGameIds = [];
        for (let i = 1; i < nextGameId; i++) {
            const gameAfterCreation = await contract.games(i);
            if (gameAfterCreation.player.toLowerCase() == account && gameAfterCreation.currentState != 5) {
                activeGameIds[activeGameIds.length] = i;
                activeCount++;
            }
        }
        return activeGameIds;
    }
    const getRoundBasedonGameId = async () => {
        let activeCount = 0;
        const nextGameId = await contract.nextGameId();
        var activeGameIds = [];
        for (let i = 1; i < nextGameId; i++) {
            const gameAfterCreation = await contract.games(i);
            if (gameAfterCreation.player.toLowerCase() == account && gameAfterCreation.currentState != 5) {
                activeGameIds.push([gameAfterCreation.rounds, i]);
                activeCount++;
            }
        }
        return activeGameIds;
    }

    const playerRewards = async () => {
        let activeCount = 0;
        const nextGameId = await contract.nextGameId();
        var rewardsIds = [];
        for (let i = 1; i < nextGameId; i++) {
            const gameAfterCreation = await contract.games(i);
            if (gameAfterCreation.player.toLowerCase() == account && gameAfterCreation.currentState != 5) {
                const Rewards = parseFloat(gameAfterCreation.reward);
                rewardsIds[Rewards] = i;
                activeCount++;
            }
        }
        return rewardsIds;
    }

    return { playGame, withdraw, createGame, availableGameBasedOnPlayerAddress,getRoundBasedonGameId, playerRewards };
}