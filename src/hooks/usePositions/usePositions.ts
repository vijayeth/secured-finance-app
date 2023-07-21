import { Currency } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSF from 'src/hooks/useSecuredFinance';
import { RootState } from 'src/store/types';
import { hexToCurrencySymbol, toCurrency } from 'src/utils';

export type Position = {
    currency: string;
    maturity: string;
    amount: BigNumber;
    forwardValue: BigNumber;
    midPrice: BigNumber;
};

export const usePositions = (account: string | undefined) => {
    const securedFinance = useSF();

    const { lastActionTimestamp, latestBlock } = useSelector(
        (state: RootState) => state.blockchain
    );

    const [positions, setPositions] = useState<Array<Position>>([]);

    const fetchPositions = useCallback(async () => {
        if (!securedFinance || !account) {
            setPositions([]);
            return;
        }

        const usedCurrenciesListInHex =
            await securedFinance.getUsedCurrenciesForOrders(account);
        const convertedCurrencies = usedCurrenciesListInHex
            .map(currency => {
                const symbol = hexToCurrencySymbol(currency);
                const convertedCurrency = symbol ? toCurrency(symbol) : null;
                return convertedCurrency;
            })
            .filter((currency): currency is Currency => currency !== null);

        const positions = await securedFinance.getPositions(
            account,
            convertedCurrencies
        );
        const mappedPositions = positions.map(position => ({
            currency: position.ccy,
            maturity: position.maturity.toString(),
            amount: position.presentValue,
            forwardValue: position.futureValue,
            midPrice: calculateMidPrice(
                position.presentValue,
                position.futureValue
            ),
        }));
        setPositions(mappedPositions);
    }, [account, securedFinance]);

    useEffect(() => {
        fetchPositions();
    }, [latestBlock, fetchPositions, lastActionTimestamp]);

    return positions;
};

const calculateMidPrice = (
    presentValue: BigNumber,
    futureValue: BigNumber
): BigNumber => {
    const midPrice = presentValue.mul(1000000).div(futureValue);
    return BigNumber.from(Math.round(midPrice.toNumber() / 100));
};
