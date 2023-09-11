// LiquidityPoolSetup.js
import { getContract } from "../../hooks/useContracts";
import { ethers } from "ethers";
import UniPairABI from "../../data/abi/uniswapPair.json";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const setupLiquidityPool = async (args) => {
  const {
    tokenAddress1, tokenAddress2, tokenAmount1, tokenAmount2,
    provider, uniFactoryContract, uniRouterContract,
    tokenReserve, prevTokenAmount1, prevTokenAmount2,
    setTokenReserve, setTokenQuote1, setTokenQuote2,
    setPrevTokenAmount1, setPrevTokenAmount2
  } = args;


  if (tokenAddress1 && tokenAddress2) {
    const liquidityPoolAddress = await uniFactoryContract.getPair(tokenAddress1, tokenAddress2);
    if (liquidityPoolAddress && liquidityPoolAddress !== ZERO_ADDRESS) {
      const LiquidityPoolContract = getContract(liquidityPoolAddress, UniPairABI, provider);
      const reservesss = await LiquidityPoolContract.getReserves();
      setTokenReserve(reservesss);
    }

    if ((tokenAmount1 !== "" && !isNaN(tokenAmount1)) || (tokenAmount2 !== "" && !isNaN(tokenAmount2))) {
      try {
        if (!isNaN(tokenAmount1) && tokenAmount1 !== prevTokenAmount1) {
          // Quote for Second Token
          const tempTokenAmountETH = ethers.utils.parseEther(tokenAmount1);
          let tempTokenQuote = await uniRouterContract.getAmountOut(tempTokenAmountETH, tokenReserve[0], tokenReserve[1]);
          tempTokenQuote = ethers.utils.formatEther(tempTokenQuote);
          tempTokenQuote = customRound(tempTokenQuote);
          setTokenQuote2(tempTokenQuote);
          setPrevTokenAmount1(tokenAmount1);
        } else if (!isNaN(tokenAmount2) && tokenAmount2 !== prevTokenAmount2) {
          // Quote for First Token
          const tempTokenAmountETH = ethers.utils.parseEther(tokenAmount2);
          let tempTokenQuote = await uniRouterContract.getAmountOut(tempTokenAmountETH, tokenReserve[1], tokenReserve[0]);
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
  } else {
    setTokenReserve("", "");
  }
  function customRound(number) {
    number = parseFloat(number);
    number = number.toFixed(2);
    return number;
  }
};


