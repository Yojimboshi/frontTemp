import { ethers } from "ethers";
import BigNumber from 'bignumber.js';
import {
  getTokenAllowance,
  getTokenApproval,
  getTokenSymbol,
  getTokenDecimal,
  getUserBalance,
  getTotalSupply,
  getTokenPairforToken0AndToken1,
  getTokenPairApproval,
  getTokenPairAllowance,
} from "../../hooks/useTokenContract";

export async function getTokenLiquidityBalance(
  tokenAddress1,
  tokenAddress2,
  provider,
  userAddress,
  tokenReserve
) {
  let token0 = 0;
  let token1 = 0;
  let pairTotalSupply = await getTotalSupply(
    tokenAddress1,
    tokenAddress2,
    provider
  );
	pairTotalSupply = new BigNumber(pairTotalSupply.toString());

  let userBalance = await getUserBalance(
    tokenAddress1,
    tokenAddress2,
    provider,
    userAddress
  );
	userBalance = new BigNumber(userBalance.toString());

  let tokensPairAddress = await getTokenPairforToken0AndToken1(
    tokenAddress1,
    tokenAddress2,
    provider
  );

  if (tokensPairAddress.token0 == tokenAddress1 && typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
    token0 = (userBalance * tokenReserve[0]) / pairTotalSupply;
    token1 = (userBalance * tokenReserve[1]) / pairTotalSupply;
		console.log(token0.toString());
    return {
      token0: token0,
      token1: token1,
    };
  } else if (tokensPairAddress.token0 == tokenAddress2 && typeof tokenReserve[0] !== 'undefined' && typeof tokenReserve[1] !== 'undefined') {
    token1 = (userBalance * tokenReserve[0]) / pairTotalSupply;
    token0 = (userBalance * tokenReserve[1]) / pairTotalSupply;
    console.log(token0.toString());
    return {
      token0: token0,
      token1: token1,
    };
  } else {
    token0 = "";
    token1 = "";
		console.log(token0.toString());
    return {
      token0: token0,
      token1: token1,
    };
  }
}

export async function getPoolShareandUserBalance(
  tokenAddress1,
  tokenAddress2,
  provider,
  userAddress
) {
  let pairTotalSupply = await getTotalSupply(
    tokenAddress1,
    tokenAddress2,
    provider
  );
  pairTotalSupply = new BigNumber(pairTotalSupply.toString());

  let userBalance = await getUserBalance(
    tokenAddress1,
    tokenAddress2,
    provider,
    userAddress
  );
	userBalance = new BigNumber(userBalance.toString());

  const poolShare = userBalance / pairTotalSupply;
  if (!isNaN(poolShare)) {
    return {
      poolShare: poolShare.toString(),
      userBalance: userBalance.toString(),
    };
  } else {
    return {
      poolShare: "",
      userBalance: "",
    };
  }
}
