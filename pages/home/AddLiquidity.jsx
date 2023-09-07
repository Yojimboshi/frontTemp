import SetupSwapPool from "../../components/LiquidityPoolSwap/SetupSwapPool";
import { useEffect, useState } from "react";
import { setupLiquidityPool } from "../../components/LiquidityPoolSwap/LiquidityPoolSetup";
import { useAddLiquidity } from "../../hooks/useRouterContract";

const LiquidityPool = () => {
  const [tokenAddress1, setTokenAddress1] = useState("");
  const [tokenAddress2, setTokenAddress2] = useState("");
  const [tokenAmount1, setTokenAmount1] = useState("");
  const [tokenAmount2, setTokenAmount2] = useState("");
  const [tokenReserve, setTokenReserve] = useState([]);
  const [tokenQuote1, setTokenQuote1] = useState(null);
  const [tokenQuote2, setTokenQuote2] = useState(null);
  const [prevTokenAmount1, setPrevTokenAmount1] = useState("");
  const [prevTokenAmount2, setPrevTokenAmount2] = useState("");
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

    
  }, [tokenAddress1, tokenAddress2, tokenAmount1, tokenAmount2]);

  async function AddLiquidity (){
    useAddLiquidity(tokenAddress1,tokenAddress2,tokenAmount1,defaultAccount,provider,tokenReserve)
  }

  {/*<---- Interface Handler ----> */}
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

  return (
    <section className="relative lg:mt-24 lg:pb-24 mt-24 pt-10 pb-24">
       <div className="mt-16 ml-64">
      <h1 className ="text-4xl">Add Liquidity</h1>
      {defaultAccount && <h3> Address: {defaultAccount} </h3>}
      {/*<-- Swap and Pool--> */}

      <div className="md:flex md:flex-wrap">
        <div
          className={
            "dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8"
          }
        >
          <h1>Token address 1</h1>
          <input
            placeholder="Token Address"
            value={tokenAddress1}
            onChange={handleToken1AddressChange}
            className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
          />
          <div className="mt-4 mb-4">
          </div>
          <h1>Token 1 amount Added</h1>
          <input
            className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
            placeholder="0.0"
            value={tokenAmount1}
            onChange={handleToken1AmountChange}
          />
        </div>
        <div
          className={
            "dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8"
          }
        >
          <h1>Token address 2</h1>
          <input
            className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
            placeholder="Token Address"
            value={tokenAddress2}
            onChange={handleToken2AddressChange}
          />
          <div className="mt-4 mb-4">
          </div>
          <h1>Token 2 amount Added</h1>
          <input
            className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
            placeholder="0.0"
            value={tokenQuote2}
            onChange={handleToken2AmountChange}
          />
        </div>
      </div>
      <div>
        <h1>
          Token1 per Token2: {tokenReserve[0] / tokenReserve[1]} Token2 per Token1:{" "}
          {tokenReserve[1] / tokenReserve[0]}
        </h1>
      </div>
      <div>
      <button className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
          onClick={AddLiquidity}>
          Add Liquidity
        </button>
      </div>
    </div>
    </section>
   
  );
}

export default LiquidityPool;
