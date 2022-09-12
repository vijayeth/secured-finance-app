import ethereumWalletSlice from './reducer';
export { isEthereumWalletConnected, selectEthereumBalance } from './selectors';
export type { WalletsStore } from './types';

export default ethereumWalletSlice.reducer;
export const {
    updateEthWalletBalance,
    updateEthWalletUSDBalance,
    connectEthWallet,
    resetEthWallet,
} = ethereumWalletSlice.actions;
