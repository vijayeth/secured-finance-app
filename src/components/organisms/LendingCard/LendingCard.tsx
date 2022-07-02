import { RadioGroup } from '@headlessui/react';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { CollateralUsageSection } from 'src/components/atoms/CollateralUsageSection';
import { AssetSelector, TermSelector } from 'src/components/molecules';
import { setLastMessage } from 'src/store/lastError';
import { RootState } from 'src/store/types';
import { Currency, currencyList } from 'src/utils';

//TODO: move this to the SDK
enum OrderSide {
    Lend = 0,
    Borrow = 1,
}

export const LendingCard = ({
    onPlaceOrder,
}: {
    onPlaceOrder: (
        ccy: string,
        term: string,
        side: OrderSide,
        amount: number,
        rate: number
    ) => Promise<unknown>;
}) => {
    const [pendingTransaction, setPendingTransaction] = useState(false);
    const [ccy, setCcy] = useState('USD');
    const [term, setTerm] = useState('1');
    const [side, setSide] = useState<OrderSide>(OrderSide.Lend);
    const [amount, setAmount] = useState(0);
    const [rate] = useState(0);

    const dispatch = useDispatch();
    const optionList = [
        { name: 'Sep 2022' },
        { name: 'Dec 2022' },
        { name: 'Mar 2023' },
        { name: 'Jun 2023' },
        { name: 'Sep 2023' },
        { name: 'Dec 2023' },
        { name: 'Mar 2024' },
        { name: 'Jun 2024' },
        { name: 'Sep 2024' },
        { name: 'Dec 2024' },
    ];

    const {
        filecoin: { price: filecoinPrice },
        ethereum: { price: ethereumPrice },
        usdc: { price: usdcPrice },
    } = useSelector((state: RootState) => state.assetPrices);

    const assetPriceMap: Record<string, number> = {
        Ethereum: ethereumPrice,
        Filecoin: filecoinPrice,
        USDC: usdcPrice,
    };

    const shortNames = useMemo(
        () =>
            currencyList.reduce<Record<string, Currency>>(
                (acc, ccy) => ({
                    ...acc,
                    [ccy.name]: ccy.shortName,
                }),
                {}
            ),
        []
    );

    const handlePlaceOrder = useCallback(
        async (
            ccy: string,
            term: string,
            side: number,
            amount: number,
            rate: number
        ) => {
            try {
                setPendingTransaction(true);
                await onPlaceOrder(ccy, term, side, amount, rate);
                setPendingTransaction(false);
            } catch (e) {
                if (e instanceof Error) {
                    setPendingTransaction(false);
                    dispatch(setLastMessage(e.message));
                }
            }
        },
        [onPlaceOrder, dispatch]
    );

    return (
        <div className='w-80 flex-col space-y-6 rounded-lg border border-neutral bg-transparent pb-4 shadow-2xl'>
            <RadioGroup
                value={side}
                onChange={setSide}
                as='div'
                className='grid grid-flow-col grid-cols-2'
            >
                <RadioGroup.Option value={OrderSide.Borrow} as='div'>
                    {({ checked }) => (
                        <RadioGroup.Label
                            className={classNames({
                                'ring ring-red': checked,
                            })}
                        >
                            <Button fullWidth>Borrow</Button>
                        </RadioGroup.Label>
                    )}
                </RadioGroup.Option>
                <RadioGroup.Option value={OrderSide.Lend} as='div'>
                    {({ checked }) => (
                        <RadioGroup.Label
                            className={classNames({
                                'ring ring-red': checked,
                            })}
                        >
                            <Button fullWidth>Lend</Button>
                        </RadioGroup.Label>
                    )}
                </RadioGroup.Option>
            </RadioGroup>

            <div className='grid justify-center space-y-4 px-4'>
                <div className='typography-body-2 flex flex-col text-center text-white-50'>
                    <span>16.23%</span>
                    <span>Fixed Rate APY</span>
                </div>

                <AssetSelector
                    options={currencyList}
                    value={currencyList[0]}
                    transform={(v: string) => shortNames[v]}
                    priceList={assetPriceMap}
                    onAmountChange={setAmount}
                    onAssetChange={setCcy}
                />

                <TermSelector
                    options={optionList}
                    value={optionList[0]}
                    onTermChange={setTerm}
                />

                <CollateralUsageSection available={10} usage={20} />

                <Button
                    fullWidth
                    onClick={() =>
                        handlePlaceOrder(ccy, term, side, amount, rate)
                    }
                    disabled={pendingTransaction}
                    data-testid='place-order-button'
                >
                    {side ? 'Borrow' : 'Lend'}
                </Button>
            </div>
        </div>
    );
};
