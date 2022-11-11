import { ArrowUpIcon } from '@heroicons/react/outline';
import { createColumnHelper } from '@tanstack/react-table';
import classNames from 'classnames';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import {
    CoreTable,
    HorizontalTab,
    TableHeader,
} from 'src/components/molecules';
import {
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    percentFormat,
    Rate,
} from 'src/utils';
import { calculatePercentage } from 'src/utils/collateral';

export type OrderBookEntry = {
    amount: BigNumber;
    apy: Rate;
    price: number;
};

const columnHelper = createColumnHelper<OrderBookEntry>();

const OrderBookCell = ({
    value,
    color = 'neutral',
}: {
    value: string;
    color?: 'neutral' | 'red' | 'green';
}) => (
    <span
        className={classNames('typography-caption-2 ', {
            'text-galacticOrange': color === 'red',
            'text-nebulaTeal': color === 'green',
            'text-neutral-6': color === 'neutral',
        })}
    >
        {value}
    </span>
);

const AmountCell = ({
    value,
    currency,
}: {
    value: BigNumber;
    currency: CurrencySymbol;
}) => (
    <OrderBookCell
        value={ordinaryFormat(currencyMap[currency].fromBaseUnit(value))}
    />
);

const PriceCell = ({
    value,
    amount,
    totalAmount,
    position,
}: {
    value: string;
    amount: BigNumber;
    totalAmount: BigNumber;
    position: 'borrow' | 'lend';
}) => {
    const color = position === 'borrow' ? 'red' : 'green';
    const align = position === 'borrow' ? 'right' : 'left';
    return (
        <>
            <OrderBookCell value={value} color={color} />
            <ColorBarCell
                value={amount}
                total={totalAmount}
                color={color}
                align={align}
            />
        </>
    );
};

const ColorBarCell = ({
    value,
    total,
    color,
    align,
}: {
    value: BigNumber;
    total: BigNumber;
    color: 'red' | 'green';
    align: 'left' | 'right';
}) => {
    const width = Math.max(
        3,
        Math.trunc(calculatePercentage(value, total).toNumber() / 1.1)
    );
    return (
        <div
            className={classNames('absolute bottom-1  h-7 opacity-20', {
                'bg-galacticOrange': color === 'red',
                'bg-nebulaTeal': color === 'green',
                'left-3': align === 'left',
                'right-3': align === 'right',
            })}
            style={{ width: `${width}%` }}
        ></div>
    );
};

export const OrderWidget = ({
    buyOrders,
    sellOrders,
    currency,
}: {
    buyOrders: Array<OrderBookEntry>;
    sellOrders: Array<OrderBookEntry>;
    currency: CurrencySymbol;
}) => {
    const totalBuyAmount = useMemo(
        () =>
            buyOrders.reduce(
                (acc, order) => acc.add(order.amount),
                BigNumber.from(0)
            ),
        [buyOrders]
    );

    const buyColumns = useMemo(
        () => [
            columnHelper.accessor('apy', {
                cell: info => (
                    <OrderBookCell
                        value={info.getValue().toPercent().toString()}
                    />
                ),
                header: () => <TableHeader title='% APY' />,
            }),
            columnHelper.accessor('amount', {
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => <TableHeader title={`Amount (${currency})`} />,
            }),
            columnHelper.accessor('price', {
                cell: info => (
                    <PriceCell
                        value={info.getValue().toString()}
                        amount={info.row.original.amount}
                        totalAmount={totalBuyAmount}
                        position='borrow'
                    />
                ),
                header: () => <TableHeader title='Price' />,
            }),
        ],
        [currency, totalBuyAmount]
    );

    const sellColumns = useMemo(
        () => [
            columnHelper.accessor('price', {
                cell: info => (
                    <PriceCell
                        value={info.getValue().toString()}
                        amount={info.row.original.amount}
                        totalAmount={totalBuyAmount}
                        position='lend'
                    />
                ),
                header: () => <TableHeader title='Price' />,
            }),
            columnHelper.accessor('amount', {
                cell: info => (
                    <AmountCell value={info.getValue()} currency={currency} />
                ),
                header: () => <TableHeader title={`Amount (${currency})`} />,
            }),
            columnHelper.accessor('apy', {
                cell: info => (
                    <OrderBookCell
                        value={info.getValue().toPercent().toString()}
                    />
                ),
                header: () => <TableHeader title='% APY' />,
            }),
        ],
        [currency, totalBuyAmount]
    );

    return (
        <>
            <HorizontalTab
                tabTitles={['Order Book', 'Market Trades', 'My Orders']}
            >
                <>
                    <div className='flex h-14 flex-row justify-center gap-1 border-b border-white-10 bg-black-20'>
                        <ArrowUpIcon className='mt-1.5 flex h-4 text-green' />

                        <div className='typography-portfolio-heading flex text-white'>
                            {percentFormat(20)}
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <CoreTable
                            data={buyOrders}
                            columns={buyColumns}
                            options={{
                                align: 'right',
                            }}
                        />
                        <CoreTable
                            data={sellOrders}
                            columns={sellColumns}
                            options={{
                                align: 'left',
                            }}
                        />
                    </div>
                </>
            </HorizontalTab>
        </>
    );
};
