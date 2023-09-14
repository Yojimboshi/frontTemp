import SetupSwapPool from "../../components/LiquidityPoolSwap/SetupSwapPool";
import { useEffect, useState } from "react";
import { setupLiquidityPool } from "../../components/LiquidityPoolSwap/LiquidityPoolSetup";
import { useRemoveLiquidity } from "../../hooks/useRouterContract";
import { getTokenApproval, getTokenAllowance, getTokenSymbol } from "../../hooks/useTokenContract";
import { getTokenLiquidityBalance, getPoolShareandUserBalance } from "../../components/LiquidityPoolSwap/LiquidityPoolFunctions";

const LiquidityPool = () => {
  const [tokenAddress1, setTokenAddress1] = useState("");
  const [tokenAddress2, setTokenAddress2] = useState("");
  const [liquidityPercentage, setliquidityPercentage] = useState("");
  const [tokenReserve, setTokenReserve] = useState([]);
  const [prevTokenAmount1, setPrevTokenAmount1] = useState("");
  const [prevTokenAmount2, setPrevTokenAmount2] = useState("");
  const [tokenQuote1, setTokenQuote1] = useState(null);
  const [tokenQuote2, setTokenQuote2] = useState(null);
  const [tokenApproved, setTokenApproved] = useState(true);
  const [tokenPairState, setTokenPairState] = useState(false);
  const [buttonText, setButtonText] = useState('Insert Token Pair');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [tokenSymbol1, setTokenSymbol1] = useState("");
  const [tokenSymbol2, setTokenSymbol2] = useState("");
  const [selectedOption, setSelectedOption] = useState('');
  const [liquidityTokenBalance, setLiquidityTokenBalance] = useState("");
  const [userPoolShare, setUserPoolShare] = useState("");
  const { provider, defaultAccount } = SetupSwapPool();

  useEffect(() => {
    setupLiquidityPool({
      tokenAddress1,
      tokenAddress2,
      provider,
      tokenReserve,
      prevTokenAmount1,
      prevTokenAmount2,
      setTokenReserve,
      setTokenQuote1,
      setTokenQuote2,
      setPrevTokenAmount1,
      setPrevTokenAmount2
    });
    if (tokenAddress1 == "" && tokenAddress2 == "") {
      
    } else {
    getLiquidityBalance();
    getPoolShare();
    getTokenSymbols();
    }

  }, [tokenAddress1, tokenAddress2]);

  async function RemoveLiquidity() {
    if (!isNaN(tokenAmount1)) {
      useRemoveLiquidity(tokenAddress1, tokenAddress2, liquidityPercentage, defaultAccount, provider, tokenReserve)
    }
  }

  async function getTokenSymbols() {
    try {
      const token1Symbol = await getTokenSymbol(tokenAddress1, provider);
      const token2Symbol = await getTokenSymbol(tokenAddress2, provider);
      setTokenSymbol1(token1Symbol)
      setTokenSymbol2(token2Symbol)
    } catch (error) {
      console.log(error)
    }
  }

  async function getLiquidityBalance() {
    const liquidityBalance = await getTokenLiquidityBalance(tokenAddress1, tokenAddress2, provider, defaultAccount, tokenReserve)
    setLiquidityTokenBalance(liquidityBalance);
  }

  async function getPoolShare() {
    const userPoolShare = await getPoolShareandUserBalance(tokenAddress1, tokenAddress2, provider, defaultAccount);
    setUserPoolShare(userPoolShare);
  }
  {/*<---- Interface Handler ----> */ }
  const handleToken1AddressChange = (event) => {
    setTokenAddress1(event.target.value);
  };

  const handleToken2AddressChange = (event) => {
    setTokenAddress2(event.target.value);
  };

  const handleToken1AmountChange = (event) => {
    setliquidityPercentage(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="mt-16 ml-64">
      <h1 className="text-4xl">Remove Liquidity</h1>
      {/*<-- Swap and Pool--> */}

      <div className="md:flex">
        <div
          className={
            "dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8"
          }
        >
          <div className="flex">
            <h1 className=" mr-2 flex-grow">
              {tokenSymbol1 ? `${tokenSymbol1} address` : "Token 1 Address"}
            </h1>
            <select
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="">Select an Option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          <input
            className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
            placeholder="Token Address"
            value={tokenAddress1}
            onChange={handleToken1AddressChange}
          />
          <div className="flex">
            <h1 className=" mr-2 flex-grow">
              {tokenSymbol2 ? `${tokenSymbol2} address` : "Token 2 Address"}
            </h1>
            <select
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <option value="">Select an Option</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          <input
            className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
            placeholder="Token Address"
            value={tokenAddress2}
            onChange={handleToken2AddressChange}
          />
          <h1>Percentage of liquidity to be remove 1-100</h1>
          <input
            className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
            placeholder="0.0"
            value={liquidityPercentage}
            onChange={handleToken1AmountChange}
          />
        </div>
        {tokenReserve && tokenAddress1&& tokenAddress2&&
          <div
            className={
              "dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8"
            }
          >
            <h1>Token1 amount</h1>
            <h1> Token 2 Amount</h1>
          </div>
        }

      </div>
      <div>
        <h1>
          {tokenReserve && tokenAddress1&& tokenAddress2&& <h1>
            {tokenSymbol1} per {tokenSymbol2}: {(tokenReserve[0] / tokenReserve[1]).toFixed(6)} {'\n'} {tokenSymbol2} per {tokenSymbol1}:{" "}
            {(tokenReserve[1] / tokenReserve[0]).toFixed(6)}
          </h1>}
        </h1>
      </div>
      <div>
        <button className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
          onClick={RemoveLiquidity}>
          RemoveLiquidity
        </button>
      </div>
    </div>

  );
}

export default LiquidityPool;
