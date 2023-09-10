import { getContract } from "../hooks/useContracts";
import ERC20_ABI from "../data/abi/erc20.json";
import UniFactoryABI from "../data/abi/uniswapFactory.json";
import UniPairABI from "../data/abi/uniswapPair.json";
import { ethers } from "ethers";

export async function getTokenApproval(signer, tokenAddress, provider) {
	const spender = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //uniswapRouter address
	const contract = getContract(tokenAddress, ERC20_ABI, provider, signer);
	const spenderBalance = 2 ^ 256 - 1;
	try {
		await contract.approve(spender, spenderBalance);
	} catch (error) {
		console.log(error);
	}
}

export async function getUserTokenBalance(userAddress, tokenAddress, provider) {
	const contract = getContract(tokenAddress, ERC20_ABI, provider)
	try{
		let userBalance = await contract.balanceOf(userAddress);
		userBalance = ethers.utils.formatEther(userBalance)
		userBalance = Math.ceil(userBalance.toString())
		return userBalance.toString()
	}catch(error){
		console.log(error);
	}
}

export async function getTokenAllowance(userAddress, tokenAddress, provider) {
	const spender = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
	const contract = getContract(tokenAddress, ERC20_ABI, provider)
	try {
		let userTokenAllowance = await contract.allowance(userAddress, spender);
		userTokenAllowance = ethers.utils.formatEther(userTokenAllowance);
		return userTokenAllowance
	} catch (error) {
		console.log(error);
	}
}

export async function getTokenSymbol(tokenAddress, provider) {
	const contract = getContract(tokenAddress, ERC20_ABI, provider)
	try {
		const tokenSymbol = await contract.symbol();
		return tokenSymbol
	} catch (error) {
		console.log(error);
	}
}

export async function getTokenDecimal(tokenAddress, provider) {
	const contract = getContract(tokenAddress, ERC20_ABI, provider)
	try {
		const tokenDecimal = await contract.decimals();
		return tokenDecimal
	} catch (error) {
		console.log(error);
	}
}

export async function getUserBalance(tokenAddress1, tokenAddress2, provider, userAddress) {
	const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
	const spender = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
	const uniFactoryContract = getContract(factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await uniFactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	let userBalance = await pairContract.balanceOf(userAddress);
	return userBalance;
}

export async function getTotalSupply(tokenAddress1, tokenAddress2, provider) {
	const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
	const uniFactoryContract = getContract(factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await uniFactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	const totalSupply = await pairContract.totalSupply();
	return totalSupply;
}

export async function getTokenPairforToken0AndToken1(tokenAddress1, tokenAddress2, provider) {
	const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
	const uniFactoryContract = getContract(factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await uniFactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	const token0 = await pairContract.token0();
	const token1 = await pairContract.token1();
	return {
		token0: token0,
		token1: token1,
	}
}

export async function getTokenPairApproval(tokenAddress1, tokenAddress2, provider, userAddress) {
	const spender = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
	const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
	const uniFactoryContract = getContract(factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await uniFactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider, userAddress);
	const spenderBalance = 2 ^ 256 - 1;
	try {
		await pairContract.approve(spender, spenderBalance);
	} catch (error) {
		console.log(error);
	}
}

export async function getTokenPairAllowance(tokenAddress1, tokenAddress2, provider, userAddress) {
	const spender = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
	const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
	const uniFactoryContract = getContract(factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await uniFactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	try {
		let userTokenAllowance = await pairContract.allowance(userAddress, spender);
		userTokenAllowance = ethers.utils.formatEther(userTokenAllowance);
		return userTokenAllowance
	} catch (error) {
		console.log(error);
	}
}