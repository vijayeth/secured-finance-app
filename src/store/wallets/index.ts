import walletsSlice from './reducer';
import { WalletsStore } from './types';
export type { WalletBase, WalletsStore } from './types';

export const walletsSelector = (state: {
    wallets: WalletsStore;
}): WalletsStore => state.wallets;

export default walletsSlice.reducer;
export const {
    updateEthWalletBalance,
    updateEthWalletUSDBalance,
    connectEthWallet,
    updateEthWalletPortfolioShare,
    updateEthWalletDailyChange,
    updateEthWalletAssetPrice,
    updateEthWalletActions,
    updateFilWalletBalance,
    updateFilWalletUSDBalance,
    updateFilWalletAddress,
    updateFilWalletPortfolioShare,
    updateFilWalletDailyChange,
    updateFilWalletAssetPrice,
    updateFilWalletActions,
    updateTotalUSDBalance,
    resetEthWallet,
    resetFilWallet,
} = walletsSlice.actions;
