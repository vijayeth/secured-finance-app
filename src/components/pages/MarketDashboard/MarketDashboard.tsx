import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownSelector } from 'src/components/atoms';
import { MarketDashboardTopBar } from 'src/components/molecules';
import { MarketDashboardOrderCard } from 'src/components/organisms/MarketDashboardOrderCard';
import { MarketOrganism } from 'src/components/organisms/MarketOrganism';
import { OrderWidget } from 'src/components/organisms/OrderWidget';
import {
    OrderType,
    RateType,
    useCollateralBook,
    useLoanValues,
} from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import {
    selectMarketDashboardForm,
    setAmount,
    setCurrency,
    setMaturity,
    setUnitPrice,
} from 'src/store/marketDashboardForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol, formatDate, getCurrencyMapAsOptions } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

export const MarketDashboard = () => {
    const { account } = useWallet();
    const { currency, maturity, side, orderType } = useSelector(
        (state: RootState) =>
            selectMarketDashboardForm(state.marketDashboardForm)
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const optionList = useMemo(
        () =>
            Object.entries(lendingContracts).map(o => ({
                label: o[0],
                value: new Maturity(o[1]),
            })),
        [lendingContracts]
    );

    const collateralBook = useCollateralBook(account);

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const dispatch = useDispatch();
    const orderBook = useOrderbook(currency, optionList[0].value, 10);

    const selectedTerm = useMemo(() => {
        return (
            optionList.find(option => option.value.equals(maturity)) ||
            optionList[0]
        );
    }, [maturity, optionList]);

    const unitPrices = useLoanValues(
        currency,
        side === Side.BORROW ? RateType.Borrow : RateType.Lend,
        maturity
    );

    const marketValue = useMemo(() => {
        if (!unitPrices) {
            return LoanValue.ZERO;
        }

        const value =
            unitPrices[
                Object.values(lendingContracts).indexOf(maturity.toNumber())
            ];
        if (!value) {
            return LoanValue.ZERO;
        }

        return value;
    }, [unitPrices, lendingContracts, maturity]);

    const handleTermChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(setAmount(BigNumber.from(0)));
        },
        [dispatch]
    );

    return (
        <div className='mx-40 mt-7 flex flex-col gap-5' data-cy='exchange-page'>
            <div className='mb-5'>
                <DropdownSelector
                    optionList={assetList}
                    selected={assetList[0]}
                    variant='roundedExpandButton'
                    onChange={handleTermChange}
                />
            </div>
            <MarketDashboardTopBar
                asset={currency}
                options={optionList.map(o => ({
                    ...o,
                    value: o.value.toString(),
                }))}
                selected={{
                    ...selectedTerm,
                    value: selectedTerm.value.toString(),
                }}
                onTermChange={v => {
                    dispatch(setMaturity(new Maturity(v)));
                    if (orderType === OrderType.MARKET) {
                        dispatch(setUnitPrice(marketValue.price));
                    }
                }}
                transformLabel={v => {
                    const ts = optionList.find(o => o.label === v)?.value;
                    return ts ? formatDate(Number(ts)) : v;
                }}
            />
            <div className='flex flex-row gap-6'>
                <MarketDashboardOrderCard collateralBook={collateralBook} />
                <div className='flex flex-grow flex-col gap-6'>
                    <MarketOrganism
                        maturitiesOptionList={optionList}
                        rates={unitPrices.map(v => v.apy)}
                    />
                    <OrderWidget
                        buyOrders={orderBook.borrowOrderbook}
                        sellOrders={orderBook.lendOrderbook}
                        currency={currency}
                    />
                </div>
            </div>
        </div>
    );
};
