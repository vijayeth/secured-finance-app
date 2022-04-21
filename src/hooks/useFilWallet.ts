import { Network } from '@glif/filecoin-address';
import { BigNumber } from '@glif/filecoin-number';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WalletAccountModal } from 'src/components/organisms';
import { useResetFilWalletProvider } from 'src/services/filecoin';
import connectWithLedger from 'src/services/ledger/connectLedger';
import { RootState } from 'src/store/types';
import {
    fetchWallet,
    fetchWalletFailure,
    updateFilWalletActions,
    updateFilWalletAddress,
    updateFilWalletAssetPrice,
    updateFilWalletBalance,
    updateFilWalletDailyChange,
    updateFilWalletPortfolioShare,
    updateFilWalletUSDBalance,
    WalletBase,
} from 'src/store/wallets';
import { FIL_ADDRESS } from 'src/store/wallets/constants';
import {
    updateFilWalletViaProvider,
    updateFilWalletViaRPC,
} from 'src/store/wallets/helpers';
import { getFilUSDBalance } from 'src/store/wallets/selectors';
import { useFilUsd } from './useAssetPrices';
import useFilWasm from './useFilWasm';
import useModal from './useModal';

export const useFilecoinAddress = (): string => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const filecoinAddr = useSelector(
        (state: RootState) => state.wallets.filecoin.address
    );
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const fetchFilStore = useCallback(async () => {
        dispatch(fetchWallet());
        if (loaded && walletProvider !== null) {
            const [filAddr] = await walletProvider.wallet.getAccounts(
                0,
                1,
                Network.TEST
            );
            dispatch(updateFilWalletAddress(filAddr));
        } else {
            dispatch(fetchWalletFailure());
        }
    }, [dispatch, loaded, walletProvider]);

    useEffect(() => {
        fetchFilStore();
    }, [fetchFilStore]);

    return filecoinAddr;
};

export const useFilecoinBalance = (): number => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const filecoinBalance = useSelector(
        (state: RootState) => state.wallets.filecoin.balance
    );
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const fetchFilStore = useCallback(async () => {
        dispatch(fetchWallet());
        if (loaded && walletProvider != null) {
            const [filAddr] = await walletProvider.wallet.getAccounts(
                0,
                1,
                Network.TEST
            );
            const balance = await walletProvider.getBalance(filAddr);
            dispatch(updateFilWalletBalance(balance.toNumber()));
        } else {
            dispatch(fetchWalletFailure());
        }
    }, [dispatch, loaded, walletProvider]);

    useEffect(() => {
        fetchFilStore();
    }, [fetchFilStore]);

    return filecoinBalance;
};

export const useFilecoinUSDBalance = async (): Promise<number> => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const filecoinUSDBalance = useSelector(
        (state: RootState) => state.wallets.filecoin.usdBalance
    );
    const filUSDPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    // TODO: add filecoin USD balance hook call
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );

    const fetchFilStore = useCallback(async () => {
        dispatch(fetchWallet());
        if (loaded && walletProvider !== null && filUSDPrice !== 0) {
            const [filAddr] = await walletProvider.wallet.getAccounts(
                0,
                1,
                Network.TEST
            );
            const balance = await walletProvider.getBalance(filAddr);
            const usdBalance = new BigNumber(balance.toFil())
                .times(new BigNumber(filUSDPrice))
                .toNumber();
            dispatch(updateFilWalletUSDBalance(usdBalance));
        } else {
            dispatch(fetchWalletFailure());
        }
    }, [dispatch, filUSDPrice, loaded, walletProvider]);

    useEffect(() => {
        fetchFilStore();
    }, [fetchFilStore]);

    return filecoinUSDBalance;
};

export const useFilecoinWalletStore = (): WalletBase => {
    const dispatch = useDispatch();
    const { loaded } = useFilWasm();
    const { price, change } = useFilUsd();
    const filWallet = useSelector((state: RootState) => state.wallets.filecoin);
    const walletProvider = useSelector(
        (state: RootState) => state.filWalletProvider.walletProvider
    );
    const totalUSDBalance = useSelector(
        (state: RootState) => state.wallets.totalUSDBalance
    );
    const usdBalance = useSelector(getFilUSDBalance);
    const [onPresentAccountModal] = useModal(WalletAccountModal);
    const actObj = useMemo(() => {
        return {
            send: onPresentAccountModal,
            placeCollateral: onPresentAccountModal,
            signOut: useResetFilWalletProvider,
        };
    }, [onPresentAccountModal]);
    const [DOMContentLoaded, setDOMContentLoaded] = useState(false);
    const filAddr = localStorage.getItem(FIL_ADDRESS);

    window.addEventListener('DOMContentLoaded', () =>
        setDOMContentLoaded(true)
    );

    const fetchFilStore = useCallback(async () => {
        dispatch(updateFilWalletAssetPrice(price));
        dispatch(updateFilWalletDailyChange(change));
        dispatch(updateFilWalletViaProvider(walletProvider, filAddr));
        dispatch(updateFilWalletActions(actObj));
    }, [dispatch, price, change, walletProvider, filAddr, actObj]);

    useEffect(() => {
        (async () => {
            if (
                loaded &&
                totalUSDBalance !== 0 &&
                walletProvider != null &&
                price !== 0 &&
                change !== 0
            ) {
                await fetchFilStore();
            }
        })();
    }, [loaded, totalUSDBalance, walletProvider, price, change, fetchFilStore]);

    useEffect(() => {
        // fetch FIL wallet info when not connected
        (async () => {
            if (filAddr && !walletProvider && DOMContentLoaded) {
                dispatch(updateFilWalletAddress(filAddr));

                // connect FIL wallet if address is stored
                const provider = await connectWithLedger(dispatch);
                provider
                    ? dispatch(updateFilWalletActions(actObj))
                    : dispatch(updateFilWalletViaRPC(filAddr));
            }
        })();
    }, [DOMContentLoaded, actObj, dispatch, filAddr, walletProvider]);

    useEffect(() => {
        if (price !== 0 || change !== 0) {
            dispatch(updateFilWalletAssetPrice(price));
            dispatch(updateFilWalletDailyChange(change));
        }
    }, [price, change, dispatch]);

    useEffect(() => {
        // update portfolio share on totalUSDBalance change
        const portfolioShare =
            totalUSDBalance === 0
                ? 0
                : new BigNumber(usdBalance)
                      .times(100)
                      .dividedBy(new BigNumber(totalUSDBalance))
                      .toNumber();
        dispatch(updateFilWalletPortfolioShare(portfolioShare));
    }, [dispatch, totalUSDBalance, usdBalance]);

    return filWallet;
};
