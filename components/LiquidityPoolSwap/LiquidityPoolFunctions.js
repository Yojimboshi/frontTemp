// LiquidityPoolFunctions
import { ethers } from "ethers";
import BigNumber from 'bignumber.js';
import {
    getUserBalance,
    getTotalSupply,
    getTokenPairforToken0AndToken1,
    getTokenSymbol,
} from "../../hooks/useTokenContract";

export async function getTokenLiquidityBalance(
    tokenAddress1,
    tokenAddress2,
    provider,
    userAddress,
    tokenReserve) {
    let token0 = 0;
    let token1 = 0;
    let pairTotalSupply = await getTotalSupply(tokenAddress1, tokenAddress2, provider);
    let userBalance = await getUserBalance(tokenAddress1, tokenAddress2, provider, userAddress);
    let tokensPairAddress = await getTokenPairforToken0AndToken1(tokenAddress1, tokenAddress2, provider);

    pairTotalSupply = BigNumber(ethers.utils.formatEther(pairTotalSupply));
    userBalance = BigNumber(ethers.utils.formatEther(userBalance));
    if (tokensPairAddress.token0 == tokenAddress1 && typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
        token0 = (userBalance * ethers.utils.formatEther(tokenReserve[0])) / pairTotalSupply;
        token1 = (userBalance * ethers.utils.formatEther(tokenReserve[1])) / pairTotalSupply;

        return {
            token0: parseFloat(token0).toFixed(2).toString(),
            token1: parseFloat(token1).toFixed(2).toString(),
        };
    } else if (tokensPairAddress.token0 == tokenAddress2 && typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
        token0 = (userBalance * ethers.utils.formatEther(tokenReserve[1])) / pairTotalSupply;
        token1 = (userBalance * ethers.utils.formatEther(tokenReserve[0])) / pairTotalSupply;
        return {
            token0: parseFloat(token0).toFixed(2).toString(),
            token1: parseFloat(token1).toFixed(2).toString(),
        };
    } else {
        token0 = "";
        token1 = "";
        return {
            token0: token0,
            token1: token1,
        };
    }
}

export async function getRemoveTokenLiquidityBalance(
    tokenAddress1,
    tokenAddress2,
    percentageRemoval,
    provider,
    userAddress,
    tokenReserve
) {
    let token0 = 0;
    let token1 = 0;
    let pairTotalSupply = await getTotalSupply(tokenAddress1, tokenAddress2, provider);
    let userBalance = await getUserBalance(tokenAddress1, tokenAddress2, provider, userAddress);
    let tokensPairAddress = await getTokenPairforToken0AndToken1(tokenAddress1, tokenAddress2, provider);

    pairTotalSupply = BigNumber(ethers.utils.formatEther(pairTotalSupply));
    userBalance = BigNumber(ethers.utils.formatEther(userBalance));
    if (percentageRemoval != "") {
        userBalance = userBalance * (percentageRemoval / 100);
        if (tokensPairAddress.token0 == tokenAddress1 && typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
            token0 = (userBalance * ethers.utils.formatEther(tokenReserve[0])) / pairTotalSupply;
            token1 = (userBalance * ethers.utils.formatEther(tokenReserve[1])) / pairTotalSupply;
            return {
                token0: parseFloat(token0).toFixed(2).toString(),
                token1: parseFloat(token1).toFixed(2).toString(),
            };
        } else if (tokensPairAddress.token0 == tokenAddress2 && typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
            token0 = (userBalance * ethers.utils.formatEther(tokenReserve[1])) / pairTotalSupply;
            token1 = (userBalance * ethers.utils.formatEther(tokenReserve[0])) / pairTotalSupply;
            return {
                token0: parseFloat(token0).toFixed(2).toString(),
                token1: parseFloat(token1).toFixed(2).toString(),
            };
        }
    }
    else {
        token0 = "";
        token1 = "";
        return {
            token0: token0,
            token1: token1,
        };
    }
}


export async function getPriceImpact(token1Amount, tokenAddress1, tokenAddress2, provider, tokenReserve) {
    token1Amount = parseFloat(token1Amount);
    let tokensPairAddress = await getTokenPairforToken0AndToken1(tokenAddress1, tokenAddress2, provider);
    const x = parseFloat(ethers.utils.formatEther(tokenReserve[0]));
    const y = parseFloat(ethers.utils.formatEther(tokenReserve[1]));
    const k = x * y;
    if (tokenAddress1 == tokensPairAddress.token0) {
        const token0Amount = x + token1Amount;
        const newToken1Amount = k / token0Amount;
        const tokenSwapped = y - newToken1Amount;
        const priceImpact = tokenSwapped / newToken1Amount;
        return ((priceImpact * 100).toFixed(6));
    } else if (tokenAddress1 == tokensPairAddress.token1) {
        const token0Amount = y + token1Amount;
        const newToken1Amount = k / token0Amount;
        const tokenSwapped = x - newToken1Amount;
        const priceImpact = tokenSwapped / newToken1Amount;
        return ((priceImpact * 100).toFixed(6));
    } else {
        return "";
    }

}


export async function getPoolShareandUserBalance(
    tokenAddress1,
    tokenAddress2,
    provider,
    userAddress
) {
    let pairTotalSupply = await getTotalSupply(tokenAddress1, tokenAddress2, provider);
    pairTotalSupply = BigNumber(ethers.utils.formatEther(pairTotalSupply));

    let userBalance = await getUserBalance(tokenAddress1, tokenAddress2, provider, userAddress);
    userBalance = BigNumber(ethers.utils.formatEther(userBalance));

    const poolShare = (userBalance / pairTotalSupply) * 100;
    if (!isNaN(poolShare)) {
        return {
            poolShare: parseFloat(poolShare).toFixed(6).toString(),
            userBalance: parseFloat(userBalance).toFixed(0).toString(),
        };
    } else {
        return {
            poolShare: "",
            userBalance: "",
        };
    }
}

export async function storeTokenAddress(tokenAddress, provider) {
    try {
        const tokenSymbol = await getTokenSymbol(tokenAddress, provider)
        console.log(tokenSymbol);
        Cookies.set({ tokenSymbol }, tokenAddress, { expires: 7 });
        console.log("asdasda")
    } catch (error) {

    }
}
