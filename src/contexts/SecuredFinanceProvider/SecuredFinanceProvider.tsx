import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { ethers } from 'ethers';
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLendingMarkets } from 'src/hooks';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import { updateLatestBlock } from 'src/store/blockchain';
import { CurrencySymbol, getRpcEndpoint, hexToDec } from 'src/utils';
import { ChainUnsupportedError, useWallet } from 'use-wallet';

export const CACHED_PROVIDER_KEY = 'CACHED_PROVIDER_KEY';

export interface SFContext {
    securedFinance?: SecuredFinanceClient;
}

export const Context = createContext<SFContext>({
    securedFinance: undefined,
});

declare global {
    interface Window {
        securedFinanceSDK: SecuredFinanceClient;
    }
}

const SecuredFinanceProvider: React.FC = ({ children }) => {
    const [web3Provider, setWeb3Provider] =
        useState<ethers.providers.BaseProvider | null>(null);
    const { error, status, connect, account, ethereum } = useWallet();
    const [securedFinance, setSecuredFinance] =
        useState<SecuredFinanceClient>();
    const dispatch = useDispatch();

    useEthereumWalletStore();
    Object.values(CurrencySymbol).forEach(ccy => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useLendingMarkets(ccy, securedFinance);
    });

    const handleNetworkChanged = (networkId: string) => {
        if (hexToDec(networkId) !== 4) {
            alert('Unsupported network, please use Rinkeby (Chain ID: 4)');
        }
    };

    useEffect(() => {
        const connectSFClient = async (
            provider: ethers.providers.BaseProvider,
            signer?: ethers.Signer
        ) => {
            setWeb3Provider(provider);
            const network = await provider.getNetwork();

            const securedFinanceLib = new SecuredFinanceClient();
            await securedFinanceLib.init(signer || provider, network);

            setSecuredFinance(securedFinanceLib);
            window.securedFinanceSDK = securedFinanceLib;
        };

        if (ethereum) {
            const chainId = Number(ethereum.chainId);
            const provider = window.localStorage.getItem('FORK')
                ? ethereum?.provider
                : new ethers.providers.Web3Provider(ethereum, chainId);
            const signer = provider.getSigner();
            connectSFClient(provider, signer);
            ethereum.on('chainChanged', handleNetworkChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener(
                        'chainChanged',
                        handleNetworkChanged
                    );
                }
            };
        } else {
            const provider = ethers.getDefaultProvider(getRpcEndpoint());
            connectSFClient(provider);
        }
    }, [ethereum, status, error]);

    useEffect(() => {
        if (status === 'error') {
            if (error instanceof ChainUnsupportedError) {
                alert('Unsupported network, please use Rinkeby (Chain ID: 4)');
            } else {
                console.error(error);
            }
        }
    }, [status, error]);

    useEffect(() => {
        if (account) {
            return;
        }
        const cachedProvider = localStorage.getItem(CACHED_PROVIDER_KEY);
        if (cachedProvider !== null) {
            connect('injected');
        }
    }, [connect, account]);

    // Update the latest block every 2 seconds with the latest block number.
    // If we are working with a fork, we just update it once with a hardcoded block number.
    useEffect(() => {
        if (!web3Provider) return;

        const interval = setInterval(async () => {
            const block = window.localStorage.getItem('FORK')
                ? 0
                : await web3Provider.getBlockNumber();
            dispatch(updateLatestBlock(block));
        }, 2000);

        return () => clearInterval(interval);
    }, [dispatch, web3Provider]);

    return (
        <Context.Provider value={{ securedFinance }}>
            {children}
        </Context.Provider>
    );
};

export default SecuredFinanceProvider;
