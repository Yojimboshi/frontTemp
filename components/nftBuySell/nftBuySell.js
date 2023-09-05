import { ethers } from 'ethers';
import { useEffect,useState } from 'react'; 
import nftBuySell from '../../data/abi/nftMintAbi.json';
import { nftContractAddress } from '../../config/setting';
import { useWallet } from '../../context/walletContext';


export default function useNftBuySell() {
    const { account } = useWallet();
    const [contract, setContract] = useState(null);
    useEffect(() => {
        if (window.ethereum && account) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(nftContractAddress, nftBuySell, signer);
            setContract(nftContract);
            // console.log('success');
        } else {
            console.error('MetaMask extension not found or account not connected.');
        }
    }, [account]);

    const buy = (tokenId, payAmount) => {
        // console.log(payAmount);
        if(!contract){
            console.error('Contract not initialized');
            return;
        }
        if (isNaN(payAmount) || parseFloat(payAmount) <= 0) {
            console.error('Invalid payAmount:', payAmount);
            return;
        }

        try{
            const totalAmount = ethers.utils.parseEther(payAmount);
            return contract.buyNFT(tokenId, { value: totalAmount, gasLimit: 1200000});
        }catch(error){
            console.error('Error while buying NFT: ', error);
        }
    };
    return { buy };
}