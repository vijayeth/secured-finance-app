import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    CollateralTabLeftPane,
    CollateralTabRightPane,
} from 'src/components/molecules';
import { CollateralBook } from 'src/hooks';
import { RootState } from 'src/store/types';
import { selectCollateralCurrencyBalance } from 'src/store/wallet';
import {
    amountFormatterFromBase,
    CollateralInfo,
    CurrencySymbol,
    getCurrencyMapAsList,
} from 'src/utils';
import { useWallet } from 'use-wallet';
import { DepositCollateral } from '../DepositCollateral';
import { WithdrawCollateral } from '../WithdrawCollateral';

const generateCollateralList = (
    balance: Partial<Record<CurrencySymbol, number | BigNumber>>
): Record<CurrencySymbol, CollateralInfo> => {
    let collateralRecords: Record<string, CollateralInfo> = {};

    getCurrencyMapAsList()
        .filter(ccy => ccy.isCollateral)
        .forEach(currencyInfo => {
            const ccy = currencyInfo.symbol;
            const collateralInfo = {
                [ccy]: {
                    symbol: ccy,
                    name: ccy,
                    available: balance[ccy]
                        ? typeof balance[ccy] === 'number'
                            ? (balance[ccy] as number)
                            : amountFormatterFromBase[ccy](
                                  balance[ccy] as BigNumber
                              )
                        : 0,
                },
            };
            collateralRecords = { ...collateralRecords, ...collateralInfo };
        });

    return collateralRecords;
};

export const CollateralTab = ({
    collateralBook,
}: {
    collateralBook: CollateralBook;
}) => {
    const { account } = useWallet();
    const [openModal, setOpenModal] = useState<'' | 'deposit' | 'withdraw'>('');

    const balances = useSelector((state: RootState) =>
        selectCollateralCurrencyBalance(state)
    );

    const depositCollateralList = useMemo(
        () => generateCollateralList(balances),
        [balances]
    );

    const withdrawCollateralList = useMemo(
        () => generateCollateralList(collateralBook.collateral),
        [collateralBook.collateral]
    );

    return (
        <div className='flex h-[410px] w-full flex-row'>
            <CollateralTabLeftPane
                onClick={step => setOpenModal(step)}
                account={account}
                collateralBook={collateralBook}
            />
            <CollateralTabRightPane
                account={account}
                collateralBook={collateralBook}
            />
            <DepositCollateral
                isOpen={openModal === 'deposit'}
                onClose={() => setOpenModal('')}
                collateralList={depositCollateralList}
            ></DepositCollateral>
            <WithdrawCollateral
                isOpen={openModal === 'withdraw'}
                onClose={() => setOpenModal('')}
                collateralList={withdrawCollateralList}
            ></WithdrawCollateral>
        </div>
    );
};
