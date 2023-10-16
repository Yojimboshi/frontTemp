import { createSlice } from '@reduxjs/toolkit'

const DEFAULT_DEADLINE_FROM_NOW = 60 * 30
const currentTimestamp = () => new Date().getTime()

function pairKey(token0Address, token1Address) {
  return `${token0Address};${token1Address}`
}

const initialState = {
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  pairs: {},
  timestamp: currentTimestamp(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addSerializedToken: function(state, action) {
      const serializedToken = action.payload;
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {};
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken;
      state.timestamp = currentTimestamp();
    },
    addSerializedPair: function(state, action) {
      const serializedPair = action.payload.serializedPair;
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId;
        state.pairs[chainId] = state.pairs[chainId] || {};
        state.pairs[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair;
      }
      state.timestamp = currentTimestamp();
    },
  }
});


export const {
  addSerializedPair,
  addSerializedToken,
} = userSlice.actions

export default userSlice.reducer