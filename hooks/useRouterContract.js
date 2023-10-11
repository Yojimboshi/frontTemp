// useRouterContract.js
import { getContract } from "../hooks/useContracts";
import uniSwapRouter_ABI from "../data/abi/uniswapRouter";
import { ethers } from "ethers";
import BigNumber from 'bignumber.js';
import {
	getTokenAllowance, getTokenApproval,
	getTokenSymbol, getTokenDecimal, getUserBalance, getTotalSupply,
	getTokenPairforToken0AndToken1, getTokenPairApproval, getTokenPairAllowance
} from "./useTokenContract";
import {etherRouterContractV2,etherFactoryContractV2,binanceTestFactoryContractV2,binanceTestRouterContractV2,binanceFactoryContractV2,binanceRouterContractV2
} from "../config/setting";
import { toast } from 'react-toastify';

const Fee = 0.003;
export async function useAddLiquidity(
	tokenAddress1,
	tokenAddress2,
	token1Amount,
	token2Amount,
	userAddress,
	provider,
	tokenReserve
) {
	try {
	const contractAddress = await blockChainServer(provider);
	let amountOutMinToken1 = 0;
	let amountOutMinToken2 = 0;
	checkTokenAllowance(token1Amount, userAddress, tokenAddress1, provider);
	const contract = getContract(contractAddress.routerAddress, uniSwapRouter_ABI, provider, userAddress);
	const deadline = Math.floor(Date.now() / 1000) + 600; // 10minute from the add liquidity
	const token1PerToken2 = tokenReserve[0] / tokenReserve[1];
	const tokenDecimal1 = await getTokenDecimal(tokenAddress1, provider)
	const tokenDecimal2 = await getTokenDecimal(tokenAddress2, provider)
	if (typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
		token2Amount = token1Amount * token1PerToken2;
		checkTokenAllowance(token2Amount, userAddress, tokenAddress2, provider);
		token2Amount = parseFloat(token2Amount).toFixed(6);
		const tokenReserve1 = ethers.utils.formatEther(tokenReserve[0])
		const tokenReserve2 = ethers.utils.formatEther(tokenReserve[1])
		const expectedPriceToken1 = getAmountOutV2(token1Amount, tokenReserve1, tokenReserve2, tokenDecimal1, tokenDecimal2, Fee);
		amountOutMinToken1 = expectedPriceToken1 * 0.001;
		amountOutMinToken1 = parseFloat(amountOutMinToken1).toFixed(6);
		amountOutMinToken1 = ethers.utils.parseEther(amountOutMinToken1.toString());
		const expectedPriceToken2 = getAmountOutV2(token2Amount, tokenReserve2, tokenReserve1, tokenDecimal1, tokenDecimal2, Fee);
		amountOutMinToken2 = expectedPriceToken2 * 0.001;
		amountOutMinToken2 = parseFloat(amountOutMinToken2).toFixed(6);
		amountOutMinToken2 = ethers.utils.parseEther(amountOutMinToken2.toString());
		token2Amount = ethers.utils.parseEther(token2Amount.toString());
		token1Amount = ethers.utils.parseEther(token1Amount.toString());
		await contract.addLiquidity(
			tokenAddress1,
			tokenAddress2,
			token1Amount,
			token2Amount,
			amountOutMinToken1,
			amountOutMinToken2,
			userAddress,
			deadline
		);
		return
	} else {
		amountOutMinToken1 = changeToEther(amountOutMinToken1);
		amountOutMinToken2 = changeToEther(amountOutMinToken2);
		token2Amount = ethers.utils.parseEther(token2Amount.toString());
		token1Amount = ethers.utils.parseEther(token1Amount.toString());
		console.log(amountOutMinToken1.toString());
		console.log(amountOutMinToken2.toString());
		console.log(deadline)
		await contract.addLiquidity(
			tokenAddress1,
			tokenAddress2,
			token1Amount,
			token2Amount,
			token1Amount,
			token2Amount,
			userAddress,
			deadline
		);
		return
	}
} catch (error) {
 if (error.code === 'ACTION_REJECTED') {
            toast.error("Transaction was rejected by the user.");
        } else {
            // Handle any other errors or show a generic error message
            toast.error("An error occurred. Please try again.");
        }
    }
}

export async function performTrade(
	tokenInAddress,
	tokenOutAddress,
	amountIn,
	userAddress,
	provider,
	tokenReserve
) {
	const contractAddress = await blockChainServer(provider);
	checkTokenAllowance(amountIn, userAddress, tokenInAddress, provider);
	const tokenReserve1 = ethers.utils.formatEther(tokenReserve[0])
	const tokenReserve2 = ethers.utils.formatEther(tokenReserve[1])
	const tokenDecimal1 = await getTokenDecimal(tokenInAddress, provider)
	const tokenDecimal2 = await getTokenDecimal(tokenInAddress, provider)
	let nativeToken = "";
	const network = await provider.getNetwork();
	const chainID = network.chainId;
	const tokenSymbol1 = await getTokenSymbol(tokenInAddress, provider)
	const tokenSymbol2 = await getTokenSymbol(tokenOutAddress, provider)

	const slippage = slipCalcV2(amountIn, tokenReserve1, tokenReserve2, tokenDecimal1, tokenDecimal2, Fee)
	const expectedPrice = getAmountOutV2(amountIn, tokenReserve1, tokenReserve2, tokenDecimal1, tokenDecimal2, Fee);
	const slippagePercentage = slippage / expectedPrice * 100;
	let amountOutMin = expectedPrice * 0.01;
	amountOutMin = parseFloat(amountOutMin).toFixed(6);
	amountOutMin = ethers.utils.parseEther(amountOutMin.toString());
	amountIn = ethers.utils.parseEther(amountIn.toString());

	const contract = getContract(contractAddress.routerAddress, uniSwapRouter_ABI, provider, userAddress);
	const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minute from the swap
	console.log(deadline)
	switch (chainID) {
		case 1: // Etheruem net
			nativeToken = "ETH";
			break;

		case 5: // goerli net
			nativeToken = "WETH"
			break;

		case 56: // Binance net
			nativeToken = "BNB"
			break;

		default:
			console.warn('Unsupported network');
			return;
	}

	try {
		if (tokenSymbol1 != nativeToken && tokenSymbol2 == nativeToken) {
			await contract.swapExactTokensForETH(
				amountIn,
				amountOutMin,
				[tokenInAddress, "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"],
				userAddress,
				deadline
			)
		} else if (tokenSymbol1 == nativeToken && tokenSymbol2 != nativeToken) {
			await contract.swapExactETHForTokens(
				amountIn,
				amountOutMin,
				["0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", tokenOutAddress],
				userAddress,
				deadline
			);
		} else if (tokenSymbol1 != nativeToken && tokenSymbol2 != nativeToken) {
			await contract.swapExactTokensForTokens(
				amountIn,
				amountOutMin,
				[tokenInAddress, tokenOutAddress],
				userAddress,
				deadline
			);
		}
	} catch (error) {
		console.log(error);
	}

}

export async function calculateSlipageRatio(amountIn, tokenReserve, provider) {
	const contractAddress = await blockChainServer(provider);
	const amount = changeToEther(amountIn);
	const contract = getContract(contractAddress.routerAddress, uniSwapRouter_ABI, provider);
	const amountOutV2 = contract.getAmountOut(amount, tokenReserve[0], tokenReserve[1]);
	const slippage = slipCalcV2(amountIn, tokenReserve[0], tokenReserve[1], Fee);
	return slippage / amountOutV2;
}

export async function useRemoveLiquidity(
	tokenAddress1,
	tokenAddress2,
	liquidityPrecentage,
	userAddress,
	provider,
	tokenReserve) {
	const contractAddress = await blockChainServer(provider);
	const Token0andToken1 = await getTokenPairforToken0AndToken1(tokenAddress1, tokenAddress2, provider);
	const contract = getContract(contractAddress.factoryAddress, uniSwapRouter_ABI, provider, userAddress);
	const totalSupply = await getTotalSupply(tokenAddress1, tokenAddress2, provider);
	let userBalance = await getUserBalance(tokenAddress1, tokenAddress2, provider, userAddress);
	userBalance = ethers.utils.formatEther(userBalance);
	let liquidity = userBalance * liquidityPrecentage / 100;

	checkTokenPairAllowance(tokenAddress1, tokenAddress2, provider, userAddress, liquidity)
	const amountA = liquidity * tokenReserve[0] / totalSupply;
	const amountB = liquidity * tokenReserve[1] / totalSupply;
	let amountAMin = amountA / 100 * 95;
	let amountBMin = amountB / 100 * 95;
	const deadline = Math.floor(Date.now() / 1000) + 600;
	amountAMin = ethers.utils.parseEther(amountAMin.toString());
	amountBMin = ethers.utils.parseEther(amountBMin.toString())
	liquidity = ethers.utils.parseEther(liquidity.toString())
	await contract.removeLiquidity(Token0andToken1.token0, Token0andToken1.token1, liquidity, amountAMin, amountBMin, userAddress, deadline);
}

function slipCalcV2(_amountIn, _reserveIn, _reserveOut, _deciIn, _deciOut, Fee) {
	// _deciIn and _deciOut for decimal places correction of reserves
	let amountInBN = BigNumber(_amountIn);
	let amountInWithFee = amountInBN.multipliedBy(1 - Fee);
	let reserveInBN = BigNumber(_reserveIn);
	let reserveOutBN = BigNumber(_reserveOut);

	let numerator = amountInWithFee.exponentiatedBy(2).times(reserveOutBN);
	let denominator = reserveInBN.times(reserveInBN.plus(amountInWithFee));
	let slippage = numerator.dividedBy(denominator);
	return slippage;
}


function getAmountOutV2(amountIn, reserveIn, reserveOut, DeciIn, DeciOut, Fee) {
	console.log(reserveIn);
	// DeciIn and DeciOut for decimal places correction of reserves

	let amountOut;

	let amountInBN = BigNumber(amountIn);
	let reserveInBN = BigNumber(reserveIn);
	let reserveOutBN = BigNumber(reserveOut);
	console.log(reserveInBN.toString());

	// let deciCorrection = BigNumber(10).exponentiatedBy(DeciIn-DeciOut);
	if (amountIn <= 0) {
		console.error("INSUFFICIENT_INPUT_AMOUNT");
		return -1;
	}
	if (reserveIn <= 0 || reserveOut <= 0) {
		console.error("INSUFFICIENT_LIQUIDITY");
		return -1;
	}

	function calc1() {
		let amountInWithFee = amountInBN.multipliedBy(1 - Fee);
		let numerator = amountInWithFee.multipliedBy(reserveOutBN);
		let denominator = reserveInBN.plus(amountInWithFee);
		amountOut = numerator.dividedBy(denominator);
	}
	calc1();
	
	return amountOut;
}


function changeToEther(amount) {
	const value = new BigNumber(amount);
	amount = ethers.utils.parseEther(value.toString());
	return amount.toString();
};

async function checkTokenAllowance(tokenAmount, userAddress, tokenAddress, provider) {
	const tokenAllowance = await getTokenAllowance(userAddress, tokenAddress, provider)

	if (Number(tokenAmount) >= Number(tokenAllowance)) {
		getTokenApproval(userAddress, tokenAddress, provider);
	} else {
		return;
	}
};

async function checkTokenPairAllowance(tokenAddress1, tokenAddress2, provider, userAddress, liquidity) {
	const tokenPairAllowance = await getTokenPairAllowance(tokenAddress1, tokenAddress2, provider, userAddress);
	console.log(liquidity)
	console.log(tokenPairAllowance)
	if (liquidity >= tokenPairAllowance) {
		getTokenPairApproval(tokenAddress1, tokenAddress2, provider, userAddress);
	} else {
		return;
	}
}

async function blockChainServer(provider) {
	let routerAddress = "";
	let factoryAddress = "";
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
		factoryAddress: factoryAddress
	}
}
