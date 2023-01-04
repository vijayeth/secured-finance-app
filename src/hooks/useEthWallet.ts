import { BigNumber } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAsset } from 'src/store/assetPrices/selectors';
import {
    connectEthWallet,
    resetEthWallet,
    updateEthWalletBalance,
} from 'src/store/ethereumWallet';
import { RootState } from 'src/store/types';
import { amountFormatterFromBase, CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';

export const useEthereumWalletStore = () => {
    const dispatch = useDispatch();
    const { account, balance, status } = useWallet();
    const { price, change } = useSelector((state: RootState) =>
        getAsset(CurrencySymbol.ETH)(state)
    );
    const ethereumWallet = useSelector(
        (state: RootState) => state.ethereumWallet
    );

    const getWalletBalance = useCallback(
        (balance: number | string) => {
            if (!account) return { inEther: 0 };

            const inEther = amountFormatterFromBase[CurrencySymbol.ETH](
                BigNumber.from(balance)
            );
            return { inEther };
        },
        [account]
    );

    const fetchEthStore = useCallback(
        async (account: string) => {
            const { inEther } = getWalletBalance(balance);
            dispatch(connectEthWallet(account));
            dispatch(updateEthWalletBalance(inEther));
        },
        [getWalletBalance, balance, dispatch]
    );

    const connectWallet = useCallback(
        (account: string) => {
            dispatch(connectEthWallet(account));
        },
        [dispatch]
    );

    useEffect(() => {
        if (status === 'connected' && account) {
            connectWallet(account);
        }
    }, [status, connectWallet, account]);

    useEffect(() => {
        if (account) {
            fetchEthStore(account);
        }
    }, [account, balance, change, fetchEthStore, price]);

    useEffect(() => {
        if (account === null) {
            dispatch(resetEthWallet());
        }
    }, [account, dispatch]);

    return ethereumWallet;
};
