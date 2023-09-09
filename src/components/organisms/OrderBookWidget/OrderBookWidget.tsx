import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { Fragment, useEffect, useMemo, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import ShowFirstIcon from 'src/assets/icons/orderbook-first.svg';
import ShowAllIcon from 'src/assets/icons/orderbook-full.svg';
import ShowLastIcon from 'src/assets/icons/orderbook-last.svg';
import {
    ColorBar,
    DropdownSelector,
    NavTab,
    Spinner,
} from 'src/components/atoms';
import { CoreTable, TableHeader } from 'src/components/molecules';
import { Tooltip } from 'src/components/templates';
import {
    AggregationFactorType,
    OrderBookEntry,
    useOrderbook,
    usePrepareOrderbookData,
} from 'src/hooks';
import { setMidPrice } from 'src/store/analytics';
import {
    setAmount,
    setOrderType,
    setSide,
    setSourceAccount,
    setUnitPrice,
} from 'src/store/landingOrderForm';
import { ColorFormat, OrderType } from 'src/types';
import {
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    ordinaryFormat,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';

const columnHelper = createColumnHelper<OrderBookEntry>();

const OrderBookCell = ({
    value = '',
    fontWeight = 'normal',
    color = 'neutral',
}: {
    value?: string;
    fontWeight?: 'normal' | 'semibold';
} & ColorFormat) => (
    <span
        className={classNames('typography-caption-2 z-[1] text-right', {
            'text-galacticOrange': color === 'negative',
            'text-nebulaTeal': color === 'positive',
            'text-neutral-6': color === 'neutral',
            'font-semibold': fontWeight === 'semibold',
        })}
    >
        {value ? value : <Fragment>&nbsp;</Fragment>}
    </span>
);

const AmountCell = ({
    value,
    currency,
}: {
    value: BigNumber;
    currency: CurrencySymbol;
}) => (
    <div className='typography-caption-2 flex justify-end pr-[25%] text-neutral-6'>
        {value.eq(0) ? (
            <OrderBookCell />
        ) : (
            <OrderBookCell
                value={ordinaryFormat(
                    currencyMap[currency].fromBaseUnit(value),
                    currencyMap[currency].roundingDecimal,
                    currencyMap[currency].roundingDecimal
                )}
            />
        )}{' '}
    </div>
);

const PriceCell = ({
    value,
    amount,
    totalAmount,
    position,
    align,
}: {
    value: LoanValue;
    amount: BigNumber;
    totalAmount: BigNumber;
    position: 'borrow' | 'lend';
    align: 'left' | 'right';
}) => {
    const color = position === 'borrow' ? 'negative' : 'positive';
    return (
        <div
            className={classNames(
                'typography-caption-2 relative flex items-center overflow-visible font-bold text-neutral-6',
                {
                    'justify-start': align === 'left',
                    'justify-end': align === 'right',
                }
            )}
        >
            <OrderBookCell
                value={!amount.isZero() ? formatLoanValue(value, 'price') : ''}
                color={color}
                fontWeight='semibold'
            />
            <ColorBar
                value={amount}
                total={totalAmount}
                color={color}
                align={align}
            />
        </div>
    );
};

const AprCell = ({
    value,
    display,
    align,
}: {
    value: LoanValue;
    display: boolean;
    align: 'left' | 'right';
}) => {
    return (
        <div
            className={classNames('typography-caption-2 flex', {
                'justify-start': align === 'left',
                'justify-end': align === 'right',
            })}
        >
            {display ? (
                <OrderBookCell value={formatLoanValue(value, 'rate')} />
            ) : (
                <OrderBookCell />
            )}
        </div>
    );
};

type VisibilityState = {
    showBorrow: boolean;
    showLend: boolean;
    showMidPrice: boolean;
};

type VisibilityAction = 'showOnlyBorrow' | 'showOnlyLend' | 'reset';

const initialState: VisibilityState = {
    showBorrow: true,
    showLend: true,
    showMidPrice: true,
};

const reducer = (
    state: VisibilityState,
    action: VisibilityAction
): VisibilityState => {
    switch (action) {
        case 'showOnlyBorrow':
            if (!state.showLend) {
                return initialState;
            }
            return {
                ...state,
                showBorrow: true,
                showLend: false,
                showMidPrice: false,
            };
        case 'showOnlyLend':
            if (!state.showBorrow) {
                return initialState;
            }
            return {
                ...state,
                showBorrow: false,
                showLend: true,
                showMidPrice: false,
            };
        default:
            return initialState;
    }
};

export const OrderBookWidget = ({
    orderbook,
    currency,
    variant = 'default',
}: {
    orderbook: Pick<ReturnType<typeof useOrderbook>, 'data' | 'isLoading'>;
    currency: CurrencySymbol;
    variant?: 'default' | 'itayose';
}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [aggregationFactor, setAggregationFactor] =
        useState<AggregationFactorType>(1);

    const globalDispatch = useDispatch();

    const borrowOrders = usePrepareOrderbookData(
        orderbook.data,
        'borrowOrderbook',
        aggregationFactor
    );

    const lendOrders = usePrepareOrderbookData(
        orderbook.data,
        'lendOrderbook',
        aggregationFactor
    );

    const totalBuyAmount = useMemo(
        () =>
            borrowOrders.reduce(
                (acc, order) => acc.add(order.amount),
                BigNumber.from(0)
            ),
        [borrowOrders]
    );

    const totalSellAmount = useMemo(
        () =>
            lendOrders.reduce(
                (acc, order) => acc.add(order.amount),
                BigNumber.from(0)
            ),
        [lendOrders]
    );

    const lastMidValue = useMemo(() => {
        if (borrowOrders.length === 0 || lendOrders.length === 0) {
            return LoanValue.ZERO;
        }

        return LoanValue.getMidValue(
            lendOrders[0].value,
            borrowOrders[borrowOrders.length - 1].value
        );
    }, [lendOrders, borrowOrders]);

    const buyColumns = useMemo(
        () => [
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={totalBuyAmount}
                        position='borrow'
                        align='left'
                    />
                ),
                header: () => <TableHeader title='Price' align='left' />,
            }),
            columnHelper.accessor('amount', {
                id: 'amount',
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => <TableHeader title='Amount' align='center' />,
            }),
            columnHelper.accessor('value', {
                id: 'apr',
                cell: info => (
                    <AprCell
                        value={info.getValue()}
                        display={!info.row.original.amount.eq(0)}
                        align='right'
                    />
                ),
                header: () => <TableHeader title='APR' align='right' />,
            }),
        ],
        [currency, totalBuyAmount]
    );

    const sellColumns = useMemo(
        () => [
            columnHelper.accessor('value', {
                id: 'apr',
                cell: info => (
                    <AprCell
                        value={info.getValue()}
                        display={!info.row.original.amount.eq(0)}
                        align='right'
                    />
                ),
                header: () => <TableHeader title='APR' align='right' />,
            }),
            columnHelper.accessor('amount', {
                id: 'amount',
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => <TableHeader title='Amount' align='center' />,
            }),
            columnHelper.accessor('value', {
                id: 'price',
                cell: info => (
                    <PriceCell
                        value={info.getValue()}
                        amount={info.row.original.amount}
                        totalAmount={totalSellAmount}
                        position='lend'
                        align='left'
                    />
                ),
                header: () => <TableHeader title='Price' align='left' />,
            }),
        ],
        [currency, totalSellAmount]
    );

    useEffect(() => {
        globalDispatch(setMidPrice(lastMidValue.price));
    }, [globalDispatch, lastMidValue.price]);

    const handleClick = (rowId: string, side: OrderSide): void => {
        const rowData =
            side === OrderSide.BORROW
                ? lendOrders[parseInt(rowId)]
                : borrowOrders[parseInt(rowId)];
        globalDispatch(setOrderType(OrderType.LIMIT));
        side ? globalDispatch(setSide(side)) : null;
        side === OrderSide.BORROW
            ? globalDispatch(setSourceAccount(WalletSource.METAMASK))
            : null;
        globalDispatch(setUnitPrice(rowData.value.price));
        globalDispatch(setAmount(rowData.amount));
    };

    const handleSellOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.BORROW);
    };

    const handleBuyOrdersClick = (rowId: string) => {
        handleClick(rowId, OrderSide.LEND);
    };

    const handleSellOrdersHoverRow = (rowId: string) => {
        const rowData = lendOrders[parseInt(rowId)];
        return !rowData.amount.isZero();
    };

    const handleBuyOrdersHoverRow = (rowId: string) => {
        const rowData = borrowOrders[parseInt(rowId)];
        return !rowData.amount.isZero();
    };

    return (
        <div className='grid w-full max-w-xs grid-cols-1 place-content-start gap-y-3 rounded-b-2xl border border-white-10 bg-cardBackground/60 px-3 pb-4 shadow-tab'>
            <div className='-mx-3 h-[60px] w-1/2'>
                <NavTab text='Order Book' active={true} />
            </div>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row items-start gap-3'>
                    <OrderBookIcon
                        name='showAll'
                        Icon={<ShowAllIcon className='mr-1 h-4 w-4' />}
                        onClick={() => dispatch('reset')}
                        active={state.showBorrow && state.showLend}
                    />
                    <OrderBookIcon
                        name='showLendOrders'
                        Icon={<ShowLastIcon className='mr-1 h-4 w-4' />}
                        onClick={() => dispatch('showOnlyLend')}
                        active={!state.showBorrow && state.showLend}
                    />
                    <OrderBookIcon
                        name='showBorrowOrders'
                        Icon={<ShowFirstIcon className='mr-1 h-4 w-4' />}
                        onClick={() => dispatch('showOnlyBorrow')}
                        active={!state.showLend && state.showBorrow}
                    />
                </div>
                <div className='flex items-center justify-end'>
                    <div className='w-20'>
                        <DropdownSelector
                            optionList={[
                                { label: '0.01', value: '1' },
                                { label: '0.1', value: '10' },
                                { label: '1', value: '100' },
                                { label: '10', value: '1000' },
                            ]}
                            onChange={v =>
                                setAggregationFactor(
                                    Number(v) as AggregationFactorType
                                )
                            }
                            variant='fullWidth'
                        />
                    </div>
                </div>
            </div>
            {orderbook.isLoading ? (
                <div className='flex h-full w-full items-center justify-center'>
                    <Spinner />
                </div>
            ) : (
                <>
                    <CoreTable
                        data={state.showBorrow ? borrowOrders : []}
                        columns={buyColumns}
                        options={{
                            responsive: false,
                            name: 'buyOrders',
                            border: false,
                            onLineClick: handleBuyOrdersClick,
                            hoverRow: handleBuyOrdersHoverRow,
                        }}
                    />
                    {state.showMidPrice && (
                        <div className='typography-portfolio-heading -mx-3 flex h-14 flex-row items-center justify-between bg-black-20 px-4'>
                            <span
                                className={classNames('font-semibold', {
                                    'flex flex-row items-center gap-2 text-white':
                                        variant === 'itayose',
                                    'text-nebulaTeal': variant === 'default',
                                })}
                                data-testid='last-mid-price'
                            >
                                <p>{formatLoanValue(lastMidValue, 'price')}</p>
                                {variant === 'itayose' && (
                                    <Tooltip>
                                        <p className='text-white'>
                                            Placeholder text explaining
                                            indicative opening price based on
                                            aggregated orders
                                        </p>
                                    </Tooltip>
                                )}
                            </span>

                            <span className='font-normal text-slateGray'>
                                {formatLoanValue(lastMidValue, 'rate')}
                            </span>
                        </div>
                    )}

                    <CoreTable
                        data={state.showLend ? lendOrders : []}
                        columns={[...sellColumns].reverse()}
                        options={{
                            responsive: false,
                            name: 'sellOrders',
                            border: false,
                            onLineClick: handleSellOrdersClick,
                            hoverRow: handleSellOrdersHoverRow,
                            showHeaders: false,
                        }}
                    />
                </>
            )}
        </div>
    );
};

const OrderBookIcon = ({
    Icon,
    name,
    active,
    onClick,
}: {
    Icon: React.ReactNode;
    name: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        key={name}
        aria-label={name}
        className={classNames('px-[10px] py-[11px] hover:bg-universeBlue', {
            'bg-universeBlue': active,
        })}
        onClick={onClick}
    >
        {Icon}
    </button>
);
