import { createSlice } from '@reduxjs/toolkit'
import { SerializedToken, SerializedPair } from './types'

const DEFAULT_DEADLINE_FROM_NOW = 60 * 30
const currentTimestamp = () => new Date().getTime()

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export interface UserState {

  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number

}

export const initialState: UserState = {
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addSerializedToken(state, { payload: { serializedToken } }) {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    },
    addSerializedPair(state, { payload: { serializedPair } }) {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
      state.timestamp = currentTimestamp()
    },
  }
})

export const {
  addSerializedPair,
  addSerializedToken,
} = userSlice.actions

export default userSlice.reducer