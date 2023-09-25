import { ethers } from 'ethers';
import { useEffect,useState } from 'react'; 
import numberGameAbi from '../../data/abi/numberGameAbi.json';
import { numberGameAddress } from '../../config/setting';
import { useWallet } from '../../context/walletContext';


export default function useNumberGame() {
    const { account ,balance} = useWallet();
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

    const joinGame = (entryBet) => {
        if (!contract) {
            console.error("Contract is not initialized");
            return null;
        }
        const valueToSend = ethers.utils.parseEther(entryBet); 
        return contract.joinGame({ value: valueToSend, gasLimit: 100000 });
    };

    const guess = (betValue, playerGuess) => {
        const valueToSend = ethers.utils.parseEther(betValue); 
        return contract.makeGuess(playerGuess, { value: valueToSend, gasLimit: 120000});
    };

    const withdraw = () => {
        return contract.withdraw({gasLimit: 100000});
    };
    const availableGame = () =>{
        
    }
    return { joinGame, guess, withdraw };
}