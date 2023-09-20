import { Token } from "@uniswap/sdk-core"
import { useAppDispatch, useAppSelector } from "../hooks"
import { useCallback, useMemo } from "react"
import { addSerializedPair, addSerializedToken } from "./reducer"
import { SerializedPair, SerializedToken } from './types'
import { UserAddedToken } from "../../pages/types/tokens"
import { useWeb3React } from "@web3-react/core"

export function serializeToken(token: Token): SerializedToken {
    return {
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
    }
}

export function deserializeToken(serializedToken: SerializedToken, Class: typeof Token = Token): Token {
    return new Class(
        serializedToken.chainId,
        serializedToken.address,
        serializedToken.decimals,
        serializedToken.symbol,
        serializedToken.name
    )
}

export function useAddUserToken(): (token: Token) => void {
    const dispatch = useAppDispatch()
    return useCallback(
        (token: Token) => {
            dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
        },
        [dispatch]
    )
}

function useUserAddedTokensOnChain(chainId: number | undefined | null): Token[] {
    const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens)

    return useMemo(() => {
        if (!chainId) return []
        const tokenMap: Token[] = serializedTokensMap?.[chainId]
            ? Object.values(serializedTokensMap[chainId]).map((value) => deserializeToken(value, UserAddedToken))
            : []
        return tokenMap
    }, [serializedTokensMap, chainId])
}

export function useUserAddedTokens(): Token[] {
    return useUserAddedTokensOnChain(useWeb3React().chainId)
}