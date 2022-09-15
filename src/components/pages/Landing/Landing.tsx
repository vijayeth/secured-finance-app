import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LendingCard, YieldChart } from 'src/components/organisms';
import {
    OrderSide,
    useCollateralBook,
    useLendingMarkets,
    usePlaceOrder,
} from 'src/hooks';
import { useRates } from 'src/hooks/useRates';
import { RootState } from 'src/store/types';
import { CurrencySymbol, termMap } from 'src/utils';
import { useWallet } from 'use-wallet';

export const Landing = () => {
    const { account } = useWallet();
    const { placeOrder } = usePlaceOrder();
    const { currency, side, term } = useSelector(
        (state: RootState) => state.landingOrderForm
    );

    const collateralBook = useCollateralBook(account);
    const lendingMarkets = useLendingMarkets(currency);
    const optionList = Object.entries(lendingMarkets).map(o => ({
        label: o[0],
        value: o[1].maturity.toString(),
    }));

    const rates = useRates(CurrencySymbol.FIL, 2);
    const marketRate = useMemo(() => {
        if (!rates) {
            return 0;
        }
        return rates[Object.keys(termMap).indexOf(term)];
    }, [rates, term]);

    return (
        <div
            className='flex-col items-center space-y-20 py-20'
            role='main'
            data-cy='lending-page'
        >
            <div className='flex flex-col items-center justify-center space-y-5 text-center'>
                <h1 className='typography-headline-1 text-white'>
                    Interbank-grade Lending <br />
                    Now Democratized
                </h1>
                <h2 className='typography-body-2 w-1/3 text-white-80'>
                    An elegant open-market digital asset lending solution
                    offering interoperability with traditional banking and
                    decentralization via Web3
                </h2>
            </div>
            <div className='flex flex-row items-center justify-center'>
                <LendingCard
                    onPlaceOrder={placeOrder}
                    collateralBook={collateralBook}
                    marketRate={marketRate}
                    maturitiesOptionList={optionList}
                />
                <YieldChart
                    asset={currency}
                    isBorrow={side === OrderSide.Borrow}
                    rates={rates}
                />
            </div>
        </div>
    );
};
