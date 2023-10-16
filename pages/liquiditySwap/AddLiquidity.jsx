// AddLiquidity.jsx

import SetupSwapPool from "../../components/LiquidityPoolSwap/SetupSwapPool";
import { useEffect, useState } from "react";
import { setupLiquidityPool } from "../../components/LiquidityPoolSwap/LiquidityPoolSetup";
import { useAddLiquidity } from "../../hooks/useRouterContract";
import { getUserTokenBalance, getTokenAllowance, getTokenSymbol } from "../../hooks/useTokenContract";
import { getTokenLiquidityBalance, getPoolShareandUserBalance } from "../../components/LiquidityPoolSwap/LiquidityPoolFunctions";
import { addSerializedToken } from "../../redux/user/reducer";
import { useDispatch, useSelector } from "react-redux";
import { utils } from 'ethers';
import { toast } from 'react-toastify';
import { initialTokens } from '../../config/tokens';

const LiquidityPool = () => {
    const [tokenAddress1, setTokenAddress1] = useState("");
    const [tokenAddress2, setTokenAddress2] = useState("");
    const [tokenAmount1, setTokenAmount1] = useState("");
    const [tokenAmount2, setTokenAmount2] = useState("");
    const [tokenReserve, setTokenReserve] = useState([]);
    const [tokenQuote1, setTokenQuote1] = useState("");
    const [tokenQuote2, setTokenQuote2] = useState("");
    const [prevTokenAmount1, setPrevTokenAmount1] = useState("");
    const [prevTokenAmount2, setPrevTokenAmount2] = useState("");
    const [tokenSymbol1, setTokenSymbol1] = useState("");
    const [tokenSymbol2, setTokenSymbol2] = useState("");
    const [token1Balance, setToken1Balance] = useState("");
    const [token2Balance, setToken2Balance] = useState("")
    const [liquidityTokenBalance, setLiquidityTokenBalance] = useState("");
    const [userPoolShare, setUserPoolShare] = useState("");
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [chainId, setchainId] = useState("");
    const [tokenPairAvailable, setTokenPairAvailable] = useState(false);
    const { provider, defaultAccount } = SetupSwapPool();
    const dispatch = useDispatch();
    const tokensByChainId = useSelector((state) => state.user.tokens);
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            console.log("useEffect #1 running...")
            console.log(tokenAddress2);
            setupLiquidityPool({
                tokenAddress1,
                tokenAddress2,
                tokenAmount1,
                tokenAmount2,
                provider,
                tokenReserve,
                prevTokenAmount1,
                prevTokenAmount2,
                setTokenReserve,
                setTokenQuote1,
                setTokenQuote2,
                setPrevTokenAmount1,
                setPrevTokenAmount2,
                setTokenPairAvailable
            });
            getChainId();
        }, 1000);
        console.log(tokenPairAvailable)
        return () => clearTimeout(debounceTimer);  // Clear the timer on component unmount
    }, [tokenAddress1, tokenAddress2, tokenAmount1, tokenAmount2]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            console.log("useEffect #2 running...")
            console.log(tokenAddress1, tokenAddress2, tokenReserve)
            if (
                utils.isAddress(tokenAddress1) &&
                utils.isAddress(tokenAddress2) &&
                tokenAddress1 !== tokenAddress2) {
                getLiquidityBalance();
                getPoolShare();
                getTokenSymbols();
                getTokenBalances();
            } else {
                console.log("Invalid addresses provided.");
            }
        }, 1000);

        return () => clearTimeout(debounceTimer);  // Clear the timer on component unmount
    }, [tokenPairAvailable]);


    async function AddLiquidity() {
        if (!isNaN(parseFloat(tokenAmount1)) && !isNaN(parseFloat(tokenQuote2))) {
            useAddLiquidity(tokenAddress1, tokenAddress2, tokenAmount1, tokenQuote2, defaultAccount, provider, tokenReserve);
        } else {
            toast.error("One or both token amounts are not valid numbers.");
        }
    }

    async function getChainId() {
        ethereum.request({ method: 'eth_chainId' })
            .then((chainIdHex) => {
                const chainId = parseInt(chainIdHex, 16); // Convert from hexadecimal to decimal
                setchainId(chainId.toString());
            })
    }
    async function getLiquidityBalance() {
        const liquidityBalance = await getTokenLiquidityBalance(tokenAddress1, tokenAddress2, provider, defaultAccount, tokenReserve)
        setLiquidityTokenBalance(liquidityBalance);
    }

    async function getPoolShare() {
        const userPoolShare = await getPoolShareandUserBalance(tokenAddress1, tokenAddress2, provider, defaultAccount);
        setUserPoolShare(userPoolShare);
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

    const options = Object.keys(tokensByChainId[chainId] || {}).map((address) => ({
        value: address,
        label: tokensByChainId[chainId][address].symbol,
    }));

    const filteredInitialTokens = initialTokens.filter((token) => token.chainId == chainId);

    const optionsWithInitialTokens = options.concat(filteredInitialTokens.map((token) => ({
        value: token.address,
        label: token.symbol,
    })));


    {/*<---- Interface Handler ----> */ }

    const handleToken1AddressChange = (event) => {
        setTokenAddress1(event.target.value);
    };

    const handleToken2AddressChange = (event) => {
        setTokenAddress2(event.target.value);
    };


    const handleStoreTokenAddress1 = async () => {
        try {
            const network = await provider.getNetwork();
            const chainID = network.chainId;
            const tokenSymbol = await getTokenSymbol(tokenAddress1, provider);
            if (typeof tokenSymbol != "undefined") {
                const serializedTokenData = {
                    chainId: chainID,
                    address: tokenAddress1,
                    symbol: tokenSymbol,
                };

                dispatch(addSerializedToken({
                    serializedToken: serializedTokenData,
                }));
            }
        } catch (error) {
            return;
        }

    };
    const handleStoreTokenAddress2 = async () => {
        try {
            const network = await provider.getNetwork();
            const chainID = network.chainId;
            const tokenSymbol = await getTokenSymbol(tokenAddress2, provider);
            if (typeof tokenSymbol != "undefined") {
                const serializedTokenData = {
                    chainId: chainID,
                    address: tokenAddress2,
                    symbol: tokenSymbol,
                };

                dispatch(addSerializedToken({
                    serializedToken: serializedTokenData,
                }));
            }
        } catch (error) {
            return
        }

    };

    const handleToken1AmountChange = async (event) => {
        setTokenAmount1(event.target.value);
    };

    const handleToken2AmountChange = (event) => {
        setTokenAmount2(event.target.value);
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
        <div className="mt-16 ml-64">
            <h1 className="text-4xl">Add Liquidity</h1>
            {/*<-- Swap and Pool--> */}

            <div className="md:flex md:flex-wrap">
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
                            {optionsWithInitialTokens.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        placeholder="Token Address"
                        value={tokenAddress1}
                        onChange={handleToken1AddressChange}
                        className="w-1/4 border border-solid dark:border-jacarta-600 border-gray-300 mb-3 rounded-full py-3 px-8 w-full m-3"
                    />
                    <div className="mt-4 mb-4">
                    </div>
                    <h1>
                        {tokenSymbol1 ? `${tokenSymbol1} Amount` : "Token 1 Amount"}
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
                    <button className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
                        onClick={handleStoreTokenAddress1}>
                        Store
                    </button>
                </div>
                <div
                    className={
                        "dark:bg-jacarta-800 dark:border-jacarta-600 border-jacarta-100 rounded-2lg border bg-white p-8"
                    }
                >
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
                            {optionsWithInitialTokens.map((option) => (
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
                    <div className="mt-4 mb-4">
                    </div>
                    <h1>
                        {tokenSymbol2 ? `${tokenSymbol2} Amount` : "Token 2 Amount"}
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
                    <button className="bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3"
                        onClick={handleStoreTokenAddress2}>
                        Store
                    </button>
                </div>
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
                {tokenReserve && tokenAddress1 && tokenAddress2 && <h1>
                    {tokenSymbol1} per {tokenSymbol2}: {(tokenReserve[0] / tokenReserve[1]).toFixed(6)} {'\n'} {tokenSymbol2} per {tokenSymbol1}:{" "}
                    {(tokenReserve[1] / tokenReserve[0]).toFixed(6)}
                </h1>}
            </div>
            <div>
                <button className={`bg-accent shadow-accent-volume hover:bg-accent-dark inline-block rounded-full py-3 px-8 text-center font-semibold text-white transition-all m-3`}
                    onClick={AddLiquidity}>
                    Add Liquidity
                </button>
            </div>
        </div>

    );
}

export default LiquidityPool;
