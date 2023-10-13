// LiquidityPoolSetup.js
import { getContract } from "../../hooks/useContracts";
import { ethers } from "ethers";
import UniPairABI from "../../data/abi/uniswapPair.json";
import UniFactoryABI from "../../data/abi/uniswapFactory.json";
import uniSwapRouter_ABI from "../../data/abi/uniswapRouter";
import {
  etherRouterContractV2, etherFactoryContractV2, binanceTestFactoryContractV2, binanceTestRouterContractV2, binanceFactoryContractV2, binanceRouterContractV2
} from "../../config/setting";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const setupLiquidityPool = async (args) => {
  const { tokenAddress1, tokenAddress2, tokenAmount1, tokenAmount2, provider,
    tokenReserve, prevTokenAmount1, prevTokenAmount2, setTokenReserve, setTokenQuote1,
    setTokenQuote2, setPrevTokenAmount1, setPrevTokenAmount2, setTokenPairAvailable,
  } = args;

  const contractAddress = await blockChainServer(provider);
  const FactoryContract = getContract(contractAddress.factoryAddress, UniFactoryABI, provider);
  const RouterContract = getContract(contractAddress.routerAddress, uniSwapRouter_ABI, provider);
  try {
    if (tokenAddress1 && tokenAddress2) {
      const liquidityPoolAddress = await FactoryContract.getPair(tokenAddress1, tokenAddress2);
      if (liquidityPoolAddress && liquidityPoolAddress !== ZERO_ADDRESS) {
        const LiquidityPoolContract = getContract(liquidityPoolAddress, UniPairABI, provider);
        const reservesss = await LiquidityPoolContract.getReserves();
        setTokenPairAvailable(true);
        if (reservesss[0].toString() != 0 && reservesss[1].toString() != 0) {
          setTokenReserve(reservesss);
        }
      } else {
        setTokenReserve("", "");
      }

      if (typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
        if ((tokenAmount1 !== "" && !isNaN(tokenAmount1)) || (tokenAmount2 !== "" && !isNaN(tokenAmount2))) {
          try {
            if (!isNaN(tokenAmount1) && tokenAmount1 !== prevTokenAmount1) {
              // Quote for Second Token
              const tempTokenAmountETH = ethers.utils.parseEther(tokenAmount1);
              let tempTokenQuote = await RouterContract.getAmountOut(tempTokenAmountETH, tokenReserve[0], tokenReserve[1]);
              tempTokenQuote = ethers.utils.formatEther(tempTokenQuote);
              tempTokenQuote = customRound(tempTokenQuote);
              setTokenQuote2(tempTokenQuote);
              setPrevTokenAmount1(tokenAmount1);
            } else if (!isNaN(tokenAmount2) && tokenAmount2 !== prevTokenAmount2) {
              // Quote for First Token
              const tempTokenAmountETH = ethers.utils.parseEther(tokenAmount2);
              let tempTokenQuote = await RouterContract.getAmountOut(tempTokenAmountETH, tokenReserve[1], tokenReserve[0]);
              tempTokenQuote = ethers.utils.formatEther(tempTokenQuote);
              tempTokenQuote = customRound(tempTokenQuote);
              setTokenQuote1(tempTokenQuote);
              setPrevTokenAmount2(tokenAmount2);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          setTokenQuote1("");
          setTokenQuote2("");
        }
      }
    }
  }catch(error){
    setTokenPairAvailable(false);
  }


  function customRound(number) {
    number = parseFloat(number);
    number = number.toFixed(2);
    return number;
  }
};

async function blockChainServer(provider) {
  if (provider === undefined) {
    return {
      routerAddress: etherRouterContractV2,
      factoryAddress: etherFactoryContractV2,
    };
  }
  let routerAddress = etherRouterContractV2;
  let factoryAddress = etherFactoryContractV2;
  const network = await provider.getNetwork();
  const chainID = network.chainId;
  switch (chainID) {
    case 1: // Etheruem net
      routerAddress = etherRouterContractV2;
      factoryAddress = etherFactoryContractV2;
      break;

    case 5: // goerli net
      routerAddress = etherRouterContractV2;
      factoryAddress = etherFactoryContractV2;
      break;

    case 56: // Binance net
      routerAddress = binanceRouterContractV2;
      factoryAddress = binanceFactoryContractV2;
      break;

    case 97: //Binance Testnet
      routerAddress = binanceTestRouterContractV2;
      factoryAddress = binanceTestFactoryContractV2;
      break;

    default:
      console.warn("Unsupported network");
      return;
  }

  return {
    routerAddress: routerAddress,
    factoryAddress: factoryAddress,
  };
}
