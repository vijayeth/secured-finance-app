import { AssetInformation, Button } from 'src/components/atoms';
import { useCollateralBook } from 'src/hooks';
import {
    CurrencySymbol,
    getDisplayBalance,
    getFullDisplayBalanceNumber,
    usdFormat,
} from 'src/utils';

interface CollateralTabLeftPaneProps {
    account?: string | null;
    onClick: (step: 'deposit' | 'withdraw') => void;
}

export const CollateralTabLeftPane: React.FC<CollateralTabLeftPaneProps> = ({
    account,
    onClick,
}) => {
    const colBook = useCollateralBook(account ? account : '');
    const balance = account
        ? getFullDisplayBalanceNumber(colBook.usdCollateral.toNumber())
        : 0;

    const quantity = colBook
        ? parseFloat(getDisplayBalance(colBook.collateral))
        : 0;

    return (
        <div className='flex h-[410px] flex-row'>
            <div className='flex flex-col border-r border-white-10'>
                <div className='h-80 w-64 border-b border-white-10'>
                    <div className='m-6 flex flex-col gap-1'>
                        <span className='typography-body-2 h-6 w-fit text-slateGray'>
                            Collateral Balance
                        </span>
                        <span className='typography-big-body-bold w-fit text-white'>
                            {usdFormat(balance, 2)}
                        </span>
                    </div>
                    {!account ? (
                        <div className='typography-caption ml-5 mt-8 w-40 text-grayScale'>
                            Connect your wallet to see your deposited collateral
                            balance.
                        </div>
                    ) : (
                        <div className='ml-5 mt-6'>
                            <AssetInformation
                                header='Collateral Assets'
                                asset={CurrencySymbol.ETH}
                                quantity={quantity}
                            ></AssetInformation>
                        </div>
                    )}
                </div>
                <div className='flex h-full flex-1 flex-row items-center justify-center gap-4'>
                    <Button
                        size='sm'
                        onClick={() => onClick('deposit')}
                        disabled={!account}
                    >
                        Deposit
                    </Button>
                    <Button
                        size='sm'
                        disabled={!account}
                        onClick={() => onClick('withdraw')}
                    >
                        Withdraw
                    </Button>
                </div>
            </div>
        </div>
    );
};
