import {ethers} from "ethers";
import {
	getTokenAllowance, getTokenApproval,
	getTokenSymbol, getTokenDecimal, getUserBalance, getTotalSupply,
	getTokenPairforToken0AndToken1, getTokenPairApproval, getTokenPairAllowance
} from "../../hooks/useTokenContract";

export async function getTokenLiquidityBalance (tokenAddress1,tokenAddress2,provider,userAddress,tokenReserve){
    let token0 = 0;
    let token1 = 0;
    let pairTotalSupply = await getTotalSupply(tokenAddress1,tokenAddress2,provider)
    let userBalance = await getUserBalance(tokenAddress1,tokenAddress2,provider,userAddress)
    let tokensPairAddress = await getTokenPairforToken0AndToken1(tokenAddress1,tokenAddress2,provider)
    pairTotalSupply = ethers.utils.format 
    if(tokensPairAddress.token0 == tokenAddress1){
        token0 = (userBalance * tokenReserve[0])/pairTotalSupply;
        console.log(token0);
        token1 = (userBalance * tokenReserve[1])/pairTotalSupply;
        token0 = 1;
        token1 = 2;
        return{
            token0: token0,
            token1: token1,
        }
    }else{
        token1 = (userBalance * tokenReserve[0])/pairTotalSupply;
        token0 = (userBalance * tokenReserve[1])/pairTotalSupply;
        console.log(token0);
        token0 = 1;
        token1 = 2;
        return{
            token0: token0,
            token1: token1,
        }
    }
}

export async function getPoolShareandUserBalance(tokenAddress1,tokenAddress2,provider,userAddress){
    let pairTotalSupply = await getTotalSupply(tokenAddress1,tokenAddress2,provider)
    let userBalance = await getUserBalance(tokenAddress1,tokenAddress2,provider,userAddress)
    const poolShare = userBalance/pairTotalSupply;
    console.log(poolShare);
    return{
        poolShare: poolShare,
        userBalance: userBalance,
    }
}