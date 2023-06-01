import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { BigNumber } from 'ethers';
import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AdvancedLendingTopBar,
    HorizontalTab,
    Tab,
} from 'src/components/molecules';
import {
    AdvancedLendingOrderCard,
    LineChartTab,
    OrderTable,
    OrderWidget,
} from 'src/components/organisms';
import { TwoColumnsWithTopBar } from 'src/components/templates';
import { CollateralBook, useGraphClientHook } from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import { useOrderList } from 'src/hooks';
import { getAssetPrice } from 'src/store/assetPrices/selectors';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
    setUnitPrice,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList, TradesQuery } from 'src/types';
import {
    CurrencySymbol,
    Rate,
    currencyMap,
    formatLoanValue,
    getCurrencyMapAsOptions,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

const useTradeHistoryDetails = (
    transactions: NonNullable<TradesQuery>['transactions'],
    currency: CurrencySymbol,
    maturity: Maturity
) => {
    return useMemo(() => {
        let min = 10000;
        let max = 0;
        let sum = BigNumber.from(0);
        let count = 0;
        for (const t of transactions) {
            const price = t.averagePrice * 10000;
            if (price < min) min = price;
            if (price > max) max = price;
            sum = sum.add(BigNumber.from(t.amount));
            count++;
        }

        return {
            min: LoanValue.fromPrice(min, maturity.toNumber()),
            max: LoanValue.fromPrice(max, maturity.toNumber()),
            sum: currencyMap[currency].fromBaseUnit(sum),
            count,
        };
    }, [currency, maturity, transactions]);
};

export const AdvancedLending = ({
    collateralBook,
    loanValue,
    maturitiesOptionList,
    rates,
}: {
    collateralBook: CollateralBook;
    loanValue: LoanValue;
    maturitiesOptionList: MaturityOptionList;
    rates: Rate[];
}) => {
    const { currency, maturity, orderType } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const currencyPrice = useSelector((state: RootState) =>
        getAssetPrice(currency)(state)
    );

    const { account } = useWallet();

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const dispatch = useDispatch();

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(maturity)
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const orderBook = useOrderbook(currency, selectedTerm.value, 10);
    const orderList = useOrderList(account);

    const ts = Math.round(new Date().getTime() / 1000);
    const tsYesterday = ts - 24 * 3600;

    const last24hoursTrades =
        useGraphClientHook(
            {
                currency: toBytes32(currency),
                maturity: maturity.toNumber(),
                from: tsYesterday,
                to: ts,
            },
            queries.TradesDocument,
            'transactions',
            false
        ).data ?? [];

    const tradeHistoryDetails = useTradeHistoryDetails(
        last24hoursTrades,
        currency,
        selectedTerm.value
    );

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            if (v === currency) return;
            dispatch(setCurrency(v));
            dispatch(setAmount(BigNumber.from(0)));
        },
        [currency, dispatch]
    );

    const handleTermChange = useCallback(
        (v: string) => {
            if (v === maturity.toString()) return;
            dispatch(setMaturity(new Maturity(v)));
            dispatch(setAmount(BigNumber.from(0)));
        },
        [maturity, dispatch]
    );

    useEffect(() => {
        dispatch(setUnitPrice(loanValue.price));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, loanValue.price, orderType, currency, maturity.toString()]);

    return (
        <TwoColumnsWithTopBar
            topBar={
                <AdvancedLendingTopBar
                    selectedAsset={selectedAsset}
                    assetList={assetList}
                    options={maturitiesOptionList.map(o => ({
                        label: o.label,
                        value: o.value.toString(),
                    }))}
                    selected={{
                        label: selectedTerm.label,
                        value: selectedTerm.value.toString(),
                    }}
                    onAssetChange={handleCurrencyChange}
                    onTermChange={handleTermChange}
                    values={[
                        formatLoanValue(tradeHistoryDetails.max, 'price'),
                        formatLoanValue(tradeHistoryDetails.min, 'price'),
                        tradeHistoryDetails.count,
                        ordinaryFormat(tradeHistoryDetails.sum),
                        usdFormat(currencyPrice, 2),
                    ]}
                />
            }
        >
            <AdvancedLendingOrderCard collateralBook={collateralBook} />
            <div className='flex min-w-0 flex-grow flex-col gap-6'>
                <Tab
                    tabDataArray={[
                        { text: 'Yield Curve' },
                        { text: 'Price History', disabled: true },
                    ]}
                >
                    <LineChartTab
                        maturitiesOptionList={maturitiesOptionList}
                        rates={rates}
                    />
                    <div />
                </Tab>
                <HorizontalTab
                    tabTitles={[
                        ['Order Book', ''],
                        ['Market Trades', ''],
                        ['My Orders', 'hidden tablet:inline'],
                        ['My Trades', 'hidden tablet:inline'],
                    ]}
                >
                    <OrderWidget
                        buyOrders={orderBook.borrowOrderbook}
                        sellOrders={orderBook.lendOrderbook}
                        currency={currency}
                    />
                    <></>
                    <OrderTable data={orderList.activeOrderList} />
                </HorizontalTab>
            </div>
        </TwoColumnsWithTopBar>
    );
};
