import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import { useWallet } from 'use-wallet';

import { getUsdcBalance, getUsdcContract } from '../services/sdk/utils';
import useSF from './useSecuredFinance';
import useBlock from './useBlock';

const useUSDCBalance = () => {
    const securedFinance = useSF();
    const usdcContact = getUsdcContract(securedFinance);
    const block = useBlock();
    const [balance, setBalance] = useState(new BigNumber(0));
    const { account, ethereum } = useWallet();

    const fetchBalance = useCallback(async () => {
        const balance = await getUsdcBalance(usdcContact, account);
        setBalance(balance);
    }, [account, usdcContact]);

    useEffect(() => {
        if (account && ethereum) {
            fetchBalance();
        }
    }, [account, block, ethereum, setBalance, usdcContact]);

    return balance;
};

export default useUSDCBalance;
