import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sellModalHide } from "../../redux/counterSlice";
import { ethers } from 'ethers';
import { useWallet } from "../../context/walletContext";
import useNftBuySell from '../nftBuySell/nftBuySell';
import { nftContractAddress } from '../../config/setting';
import nftBuySell from '../../data/abi/nftMintAbi.json';


const SellModal = () => {
  const { account } = useWallet();
  const [priceAmount, setPriceAmount] = useState("");
  const { sellModal } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const [ethToUsdRate, setEthToUsdRate] = useState(0);
  const pid = useSelector(state => state.counter.pid);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  console.log("Sell Modal running");

  useEffect(() => {
    console.log("Runingng the change to USD.");
    async function fetchEthToUsdRate() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
  
        if (data.ethereum && data.ethereum.usd) {
          setEthToUsdRate(data.ethereum.usd);
        } else {
          console.error("Unable to fetch exchange rate data.");
        }
      } catch (error) {
        console.error("An error occurred while fetching exchange rate data.");
      }
    }
  
    // Call the fetchEthToUsdRate function to fetch and update the exchange rate.
    fetchEthToUsdRate();
  },[])

  const sellNFT = async () => {
    try {
      if (window.ethereum && account) {
        setIsTransactionPending(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(nftContractAddress, nftBuySell, signer);

        const tokenId = pid.pid; // Assuming pid.pid contains the token ID
        const price = ethers.utils.parseEther(priceAmount.toString()); // Convert price to Wei

        // Call the sellNFT function without sending any Ether
        const tx = await nftContract.sellNFT(tokenId, price);
        const receipt = await tx.wait();
        dispatch(sellModalHide());
        window.location.reload();

        // You can add additional logic or UI updates as needed
        console.log("NFT Listed On Sale!");
      } else {
        console.error('MetaMask extension not found or account not connected.');
      }
    } catch (error) {
      console.error("Error listing NFT: ", error);
    } finally {
      setIsTransactionPending(false);
    }
  };


  return (
    <div>
      <div className={sellModal ? "modal fade show block" : "modal fade"}>
        <div className="modal-dialog max-w-2xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="placeBidLabel">
                List For Sale
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(sellModalHide())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-jacarta-700 h-6 w-6 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
                </svg>
              </button>
            </div>

            {/* <!-- Body --> */}
            <div className="modal-body p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-jacarta-700 text-sm font-semibold dark:text-white">
                  Price
                </span>
              </div>

              <div className="dark:border-jacarta-600 border-jacarta-100 relative mb-2 flex items-center overflow-hidden rounded-lg border">
                <div className="border-jacarta-100 bg-jacarta-50 flex flex-1 items-center self-stretch border-r px-2">
                  <span>
                    <svg className="icon icon-ETH mr-1 h-5 w-5">
                      <use xlinkHref="/icons.svg#icon-ETH"></use>
                    </svg>
                  </span>
                  <span className="font-display text-jacarta-700 text-sm">
                    ETH
                  </span>
                </div>

                <input
                  type="number"
                  className="focus:ring-accent h-12 w-full flex-[3] border-0 focus:ring-inse dark:text-jacarta-700"
                  placeholder={pid?.price || ''}
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(e.target.value)}
                />

                <div className="bg-jacarta-50 border-jacarta-100 flex flex-1 justify-end self-stretch border-l dark:text-jacarta-700">
                  <span className="self-center px-2 text-sm">
                    ${(priceAmount * ethToUsdRate).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
            {/* <!-- end body --> */}

            <div className="modal-footer">
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  className="bg-accent shadow-accent-volume hover:bg-accent-dark rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
                  onClick={sellNFT}
                  disabled={isTransactionPending}
                >
                {isTransactionPending ? "Processing...": "Sell"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellModal;