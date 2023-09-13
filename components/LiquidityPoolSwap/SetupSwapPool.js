import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import UniFactoryABI from "../../data/abi/uniswapFactory.json";
import UniRouterABI from "../../data/abi/uniswapRouter.json";

const uniSwapRouterAdd = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const uniSwapFactoryAdd = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

const SetupSwapPool = () => {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [provider, setProvider] = useState();
  const [uniFactoryContract, setUniFactoryContract] = useState(null);
  const [uniRouterContract, setUniRouterContract] = useState(null);

  useEffect(() => {
    const setup = async () => {
      try {
        if (window.ethereum) {
          window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .catch(error => {
              console.error('Error Connecting to MetaMask: ', error);
            })
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setDefaultAccount(accounts[0]);
          const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
          const tempSigner = tempProvider.getSigner();

          const tempUniRouterContract = new ethers.Contract(uniSwapRouterAdd, UniRouterABI, tempSigner);
          const tempUniFactoryContract = new ethers.Contract(uniSwapFactoryAdd, UniFactoryABI, tempSigner);

          setProvider(tempProvider);
          setUniRouterContract(tempUniRouterContract);
          setUniFactoryContract(tempUniFactoryContract);
        } else {
          console.error("MetaMask extension not found.");
        }
      } catch (error) {
        console.error("Error during setup in useConfigurationSwapPool:", error);
      }

      try {
        window.ethereum.on('accountsChanged', accounts => {
          setDefaultAccount(accounts[0]);
        });
      } catch (e) {
        console.error("Error setting up event listener for account change:", e);
      }

    };

    setup();
  }, []);

  const checkTokenContractOnGoerli = async (tokenContractAddress) => {
    try {
      const code = await provider.getCode(tokenContractAddress);
      if (code === "0x") {
        alert("Token not found");
      } else {
        alert("Token found");
      }
    } catch (error) {
      alert("Error checking token on Goerli:", error);
    }
  };


  return { provider, uniFactoryContract, uniRouterContract, defaultAccount, checkTokenContractOnGoerli };
};

export default SetupSwapPool;
