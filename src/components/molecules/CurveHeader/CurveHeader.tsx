import { useSelector } from 'react-redux';
import { CurveHeaderAsset, CurveHeaderTotal } from 'src/components/atoms';
import {
    getPriceChangeMap,
    getPriceMap,
} from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { Currency, currencyMap } from 'src/utils';

interface CurveHeaderProps {
    asset: Currency;
    isBorrow: boolean;
}

export const CurveHeader: React.FC<CurveHeaderProps> = ({
    asset = Currency.FIL,
    isBorrow,
}): JSX.Element => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));
    const priceChangeList = useSelector((state: RootState) =>
        getPriceChangeMap(state)
    );

    return (
        <div className='flex h-20 w-[585px] flex-row justify-between p-4'>
            <CurveHeaderAsset
                asset={currencyMap[asset]?.name}
                value={priceList[asset]}
                fluctuation={priceChangeList[asset]}
                IconSVG={currencyMap[asset]?.iconSVG}
            ></CurveHeaderAsset>
            <div className='flex flex-row gap-2'>
                <CurveHeaderTotal
                    header={
                        isBorrow ? 'Total Borrow (Asset)' : 'Total Lend (Asset)'
                    }
                    footer='80,000,009 FIL'
                />

                <CurveHeaderTotal
                    header={
                        isBorrow ? 'Total Borrow (USD)' : 'Total Lend (USD)'
                    }
                    footer='$650,400,073'
                />
            </div>
        </div>
    );
};
