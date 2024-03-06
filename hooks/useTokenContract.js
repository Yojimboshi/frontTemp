// useTokenContract.js

import { getContract } from "../hooks/useContracts";
import ERC20_ABI from "../data/abi/erc20.json";
import BEP20_ABI from "../data/abi/bep20.json";
import UniFactoryABI from "../data/abi/uniswapFactory.json";
import UniPairABI from "../data/abi/uniswapPair.json";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import {
	etherRouterContractV2, etherFactoryContractV2, binanceTestFactoryContractV2, binanceTestRouterContractV2, binanceFactoryContractV2, binanceRouterContractV2
} from "../config/setting";

export async function getTokenApproval(signer, tokenAddress, provider) {
	const contractAddress = await blockChainServer(provider);
	const contract = getContract(tokenAddress, contractAddress.tokenABI, provider, signer);
	const spenderBalance = 2 ^ 256 - 1;
	try {
		await contract.approve(contractAddress.routerAddress, spenderBalance);
	} catch (error) {
		toast.error(error);
	}
}

export async function getUserTokenBalance(userAddress, tokenAddress, provider) {
	const TokenABIChange = await blockChainServer(provider);
	const contract = getContract(tokenAddress, TokenABIChange.tokenABI, provider)
	try {
		let userBalance = await contract.balanceOf(userAddress);
		userBalance = ethers.utils.formatEther(userBalance)
		userBalance = Math.ceil(userBalance.toString())
		return userBalance.toString()
	} catch (error) {
		toast.error(error);
	}
}

export async function getTokenAllowance(userAddress, tokenAddress, provider) {
	const contractAddress = await blockChainServer(provider);
	const contract = getContract(tokenAddress, contractAddress.tokenABI, provider)
	try {
		let userTokenAllowance = await contract.allowance(userAddress, contractAddress.routerAddress);
		userTokenAllowance = ethers.utils.formatEther(userTokenAllowance);
		return userTokenAllowance
	} catch (error) {
		toast.error(error);
	}
}

export async function getTokenSymbol(tokenAddress, provider) {
	const TokenABIChange = await blockChainServer(provider);
	const contract = getContract(tokenAddress, BEP20_ABI, provider)
	try {
		const tokenSymbol = await contract.symbol();
		return tokenSymbol
	} catch (error) {
		toast.error(error);
	}
}

export async function getTokenDecimal(tokenAddress, provider) {
	const TokenABIChange = await blockChainServer(provider);
	const contract = getContract(tokenAddress, TokenABIChange.tokenABI, provider)
	try {
		const tokenDecimal = await contract.decimals();
		return tokenDecimal
	} catch (error) {
		toast.error(error);
	}
}

export async function getUserBalance(tokenAddress1, tokenAddress2, provider, userAddress) {
	const contractAddress = await blockChainServer(provider);
	const FactoryContract = getContract(contractAddress.factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await FactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	let userBalance = await pairContract.balanceOf(userAddress);
	return userBalance;
}

export async function getTotalSupply(tokenAddress1, tokenAddress2, provider) {
	const contractAddress = await blockChainServer(provider);
	const FactoryContract = getContract(contractAddress.factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await FactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	const totalSupply = await pairContract.totalSupply();
	return totalSupply;
}

export async function getTokenPairforToken0AndToken1(tokenAddress1, tokenAddress2, provider) {
	const contractAddress = await blockChainServer(provider);
	const FactoryContract = getContract(contractAddress.factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await FactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	const token0 = await pairContract.token0();
	const token1 = await pairContract.token1();
	return {
		token0: token0,
		token1: token1,
	}
}

export async function getTokenPairApproval(tokenAddress1, tokenAddress2, provider, userAddress) {
	const contractAddress = await blockChainServer(provider);
	const FactoryContract = getContract(contractAddress.factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await FactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider, userAddress);
	const spenderBalance = 2 ^ 256 - 1;
	try {
		await pairContract.approve(contractAddress.routerAddress, spenderBalance);
	} catch (error) {
		toast.error(error);
	}
}

export async function getTokenPairAllowance(tokenAddress1, tokenAddress2, provider, userAddress) {
	const contractAddress = await blockChainServer(provider);
	const FactoryContract = getContract(contractAddress.factoryAddress, UniFactoryABI, provider)
	const liquidityPoolAddress = await FactoryContract.getPair(tokenAddress1, tokenAddress2);
	const pairContract = getContract(liquidityPoolAddress, UniPairABI, provider);
	try {
		let userTokenAllowance = await pairContract.allowance(userAddress, contractAddress.routerAddress);
		userTokenAllowance = ethers.utils.formatEther(userTokenAllowance);
		return userTokenAllowance
	} catch (error) {
		toast.error(error);
	}
}

async function blockChainServer(provider) {
	let routerAddress = "";
	let factoryAddress = "";
	let tokenABI = ERC20_ABI;
	try{
		const network = await provider.getNetwork();
		const chainID = network.chainId;
		switch (chainID) {
			case 1: // Etheruem net
				routerAddress = etherRouterContractV2;
				factoryAddress = etherFactoryContractV2;
				tokenABI = ERC20_ABI;
				break;
	
			case 5: // goerli net
				routerAddress = etherRouterContractV2;
				factoryAddress = etherFactoryContractV2;
				tokenABI = ERC20_ABI;
				break;
	
			case 56: // Binance net
				routerAddress = binanceRouterContractV2;
				factoryAddress = binanceFactoryContractV2;
				tokenABI = BEP20_ABI;
				break;
	
			case 97: //Binance Testnet
				routerAddress = binanceTestRouterContractV2;
				factoryAddress = binanceTestFactoryContractV2;
				tokenABI = BEP20_ABI;
				break;
	
			default:
				console.warn("Unsupported network");
				return;
		}
	
		return {
			routerAddress: routerAddress,
			factoryAddress: factoryAddress,
			tokenABI: tokenABI
		}
	}catch(error){
		toast.error(error);
	}

}