import { useState, useEffect } from "react";
import SetupSwapPool from "../../components/LiquidityPoolSwap/SetupSwapPool";
import { setupLiquidityPool } from "../../components/LiquidityPoolSwap/LiquidityPoolSetup";
import { performTrade } from "../../hooks/useRouterContract";
import { getUserTokenBalance, getTokenAllowance, getTokenSymbol } from "../../hooks/useTokenContract";

const Swapping = () => {
  const [tokenAddress1, setTokenAddress1] = useState("");
  const [tokenAddress2, setTokenAddress2] = useState("");
  const [tokenAmount1, setTokenAmount1] = useState("");
  const [tokenAmount2, setTokenAmount2] = useState("");;
  const [tokenReserve, setTokenReserve] = useState([]);
  const [tokenQuote1, setTokenQuote1] = useState(null);
  const [tokenQuote2, setTokenQuote2] = useState(null);
  const [prevTokenAmount1, setPrevTokenAmount1] = useState("");
  const [prevTokenAmount2, setPrevTokenAmount2] = useState("");
  const [tokenApproved, setTokenApproved] = useState(true);
  const [tokenPairState, setTokenPairState] = useState(false);
  const [buttonText, setButtonText] = useState('Insert Token Pair');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [tokenSymbol1, setTokenSymbol1] = useState("");
  const [tokenSymbol2, setTokenSymbol2] = useState("");
  const [token1Balance, setToken1Balance] = useState("");
  const [token2Balance, setToken2Balance] = useState("");
  const [selectedOption, setSelectedOption] = useState('');
  const { provider, uniFactoryContract, uniRouterContract, defaultAccount } = SetupSwapPool();


  useEffect(() => {
    setupLiquidityPool({
      tokenAddress1,
      tokenAddress2,
      tokenAmount1,
      tokenAmount2,
      provider,
      uniFactoryContract,
      uniRouterContract,
      tokenReserve,
      prevTokenAmount1,
      prevTokenAmount2,
      setTokenReserve,
      setTokenQuote1,
      setTokenQuote2,
      setPrevTokenAmount1,
      setPrevTokenAmount2
    });
    if(tokenAddress1 != "" && tokenAddress2 != ""){
      getTokenSymbols();
      getTokenBalances();
    }

  }, [tokenAddress1, tokenAddress2, tokenAmount1, tokenAmount2]);


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

  async function getTokenBalances() {
    try {
      const t1balance = await getUserTokenBalance(defaultAccount, tokenAddress1, provider);
      const t2balance = await getUserTokenBalance(defaultAccount, tokenAddress2, provider);
      setToken1Balance(t1balance)
      setToken2Balance(t2balance)
    } catch (error) {
      console.log(error)
    }
  }

  {/*<---- Interface Handler ----> */ }

  const swapToken = async () => {
    if(!isNaN(tokenAmount1)){
      performTrade(tokenAddress1, tokenAddress2, tokenAmount1, defaultAccount, provider, tokenReserve);
    }
    
  };

  const handleToken1AddressChange = (event) => {
    setTokenAddress1(event.target.value);
  };

  const handleToken2AddressChange = (event) => {
    setTokenAddress2(event.target.value);
  };

  const handleToken1AmountChange = (event) => {
    setTokenAmount1(event.target.value);
  };

  const handleToken2AmountChange = (event) => {
    setTokenAmount2(event.target.value);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="mt-16 ml-64">
      <h1 className="text-4xl">Swap</h1>
      {/*<-- Swap and Pool--> */}

      <div className="flex flex-wrap">
        <div className="dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8 pt-4 pb-4 flex flex-col">
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
          <div className="flex flex-col">
            <input
              className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
              placeholder="Token Address"
              value={tokenAddress1}
              onChange={handleToken1AddressChange}
            />
            <h1 className="text-left mt-4">
              {tokenSymbol1 ? `${tokenSymbol1} Swap Amount` : "Token 1 Swap Amount"}
            </h1>
            <h1>
              {token1Balance ? `Balance: ${token1Balance}` : ""}
            </h1>
            <input
              className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
              placeholder="0.0"
              value={tokenAmount1}
              onChange={handleToken1AmountChange}
            />
          </div>
        </div>

        <div className="dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8 pt-4 pb-4 flex flex-col">
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
          <div className="flex flex-col">
            <input
              className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
              placeholder="Token Address"
              value={tokenAddress2}
              onChange={handleToken2AddressChange}
            />
            <h1 className="text-left mt-4">
              {tokenSymbol2 ? `${tokenSymbol2} Swap Amount` : "Token 2 Swap Amount"}
            </h1>
            <h1>
              {token2Balance ? `Balance: ${token2Balance}` : ""}
            </h1>
            <input
              className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
              placeholder="0.0"
              value={tokenQuote2}
              onChange={handleToken2AmountChange}
            />
          </div>
        </div>

      </div>
      <div>
      {tokenReserve && <h1>
          {tokenSymbol1} per {tokenSymbol2}: {(tokenReserve[0] / tokenReserve[1]).toFixed(6)} {'\n'} {tokenSymbol2} per {tokenSymbol1}:{" "}
          {(tokenReserve[1] / tokenReserve[0]).toFixed(6)}
        </h1>}
      </div>
      <button className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
        onClick={swapToken}>
        Swap
      </button>
    </div>

  );
};

export default Swapping;
