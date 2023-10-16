import SetupSwapPool from "../../components/LiquidityPoolSwap/SetupSwapPool";
import { useEffect, useState } from "react";
import { setupLiquidityPool } from "../../components/LiquidityPoolSwap/LiquidityPoolSetup";
import { useRemoveLiquidity } from "../../hooks/useRouterContract";
import { getTokenSymbol } from "../../hooks/useTokenContract";
import { getTokenLiquidityBalance, getPoolShareandUserBalance, getRemoveTokenLiquidityBalance } from "../../components/LiquidityPoolSwap/LiquidityPoolFunctions";
import { useSelector } from "react-redux";
import { utils } from 'ethers';
import { initialTokens } from '../../config/tokens';

const LiquidityPool = () => {
    const [tokenAddress1, setTokenAddress1] = useState("");
    const [tokenAddress2, setTokenAddress2] = useState("");
    const [liquidityPercentage, setliquidityPercentage] = useState("");
    const [tokenReserve, setTokenReserve] = useState([]);
    const [prevTokenAmount1, setPrevTokenAmount1] = useState("");
    const [prevTokenAmount2, setPrevTokenAmount2] = useState("");
    const [tokenQuote1, setTokenQuote1] = useState(null);
    const [tokenQuote2, setTokenQuote2] = useState(null);
    const [tokenSymbol1, setTokenSymbol1] = useState("");
    const [tokenSymbol2, setTokenSymbol2] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [liquidityTokenBalance, setLiquidityTokenBalance] = useState("");
    const [liquidityRemoveTokenBalance, setLiquidityRemoveTokenBalance] = useState("");
    const [userPoolShare, setUserPoolShare] = useState("");
    const [chainId, setchainId] = useState("");
    const [tokenPairAvailable, setTokenPairAvailable] = useState(false);
    const { provider, defaultAccount } = SetupSwapPool();
    const tokensByChainId = useSelector((state) => state.user.tokens);
    // First useEffect: Handles the initial setup
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
            setPrevTokenAmount2,
            setTokenPairAvailable,
        });
        getChainId();
    }, [tokenAddress1, tokenAddress2]);

    useEffect(() => {
        if (
            utils.isAddress(tokenAddress1) &&
            utils.isAddress(tokenAddress2) &&
            tokenAddress1 !== tokenAddress2) {
            getLiquidityBalance();
            getPoolShare();
            getTokenSymbols();
            getRemovedLiquidityBalance();
        }
    }, [tokenPairAvailable]);

    async function RemoveLiquidity() {
        if (!isNaN(liquidityPercentage)) {
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

    async function getRemovedLiquidityBalance() {
        const liquidityBalance = await getRemoveTokenLiquidityBalance(tokenAddress1, tokenAddress2, liquidityPercentage, provider, defaultAccount, tokenReserve)
        setLiquidityRemoveTokenBalance(liquidityBalance);
    }

    async function getChainId() {
        ethereum.request({ method: 'eth_chainId' })
            .then((chainIdHex) => {
                const chainId = parseInt(chainIdHex, 16); // Convert from hexadecimal to decimal
                setchainId(chainId.toString());
            })
    }

    const options = Object.keys(tokensByChainId[chainId] || {}).map((address) => ({
        value: address,
        label: tokensByChainId[chainId][address].symbol,
    }));
    const filteredInitialTokens = initialTokens.filter((token) => token.chainId == chainId);

    const optionsWithInitialTokens = options.concat(filteredInitialTokens.map((token) => ({
        value: token.address,
        label: token.symbol,
    })));

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
        setTokenAddress1(event.target.value)
    };

    const handleOption2Change = (event) => {
        setSelectedOption2(event.target.value);
        setTokenAddress2(event.target.value)
    };

    return (
        <div className="flex flex-col items-center ">
            <h1 className="text-4xl ">Remove Liquidity</h1>
            {/*<-- Swap and Pool--> */}

            <div className="md:flex flex-col ">
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
                            id="optionDropdown"
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            <option disabled value="">
                                Select an option
                            </option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
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
                            id="optionDropdown"
                            value={selectedOption2}
                            onChange={handleOption2Change}
                        >
                            <option disabled value="">
                                Select an option
                            </option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
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
                {tokenReserve && tokenAddress1 && tokenAddress2 &&
                    <div
                        className={
                            "dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8"
                        }
                    >
                        <h1>
                            Token Remove
                        </h1>
                        <h1>
                            {tokenSymbol1}: {liquidityRemoveTokenBalance.token0}
                        </h1>
                        <h1>
                            {tokenSymbol2}: {liquidityRemoveTokenBalance.token1}
                        </h1>
                        <h1>
                            {tokenReserve && tokenAddress1 && tokenAddress2 && <h1>
                                {tokenSymbol1} per {tokenSymbol2}: {(tokenReserve[0] / tokenReserve[1]).toFixed(6)} {'\n'} {tokenSymbol2} per {tokenSymbol1}:{" "}
                                {(tokenReserve[1] / tokenReserve[0]).toFixed(6)}
                            </h1>}
                        </h1>
                    </div>}
                {tokenReserve && tokenAddress1 && tokenAddress2 &&
                    <div
                        className={
                            "dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8"
                        }
                    >
                        <h1>
                            Your Position
                        </h1>
                        <h1>
                            {tokenSymbol1}/{tokenSymbol2}: {userPoolShare.userBalance}
                        </h1>
                        <h1>
                            Your pool share: {userPoolShare.poolShare}%
                        </h1>
                        <h1>
                            {tokenSymbol1}: {liquidityTokenBalance.token0}
                        </h1>
                        <h1>
                            {tokenSymbol2}: {liquidityTokenBalance.token1}
                        </h1>

                    </div>
                }

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
