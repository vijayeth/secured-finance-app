import { AssetPrices } from 'src/store/assetPrices';
import { MaturityOptionList } from 'src/types';
import { Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const preloadedAssetPrices: { assetPrices: AssetPrices } = {
    assetPrices: {
        FIL: {
            price: 6.0,
            change: -8.208519783216566,
        },
        ETH: {
            price: 2000.34,
            change: 0.5162466489453748,
        },
        USDC: {
            price: 1.0,
            change: 0.042530768538486696,
        },
        BTC: {
            price: 50000.0,
            change: 0.0,
        },
        isLoading: false,
    },
};

const dec22 = new Maturity(1669852800);
const mar23 = new Maturity(1677628800);
const jun23 = new Maturity(1685577600);
const sep23 = new Maturity(1693526400);
const dec23 = new Maturity(1701388800);
const mar24 = new Maturity(1709251200);
const jun24 = new Maturity(1717200000);
const sep24 = new Maturity(1725148800);

export const maturityOptions: MaturityOptionList = [
    { label: 'DEC22', value: dec22 },
    { label: 'MAR23', value: mar23 },
    { label: 'JUN23', value: jun23 },
    { label: 'SEP23', value: sep23 },
    { label: 'DEC23', value: dec23 },
    { label: 'MAR24', value: mar24 },
    { label: 'JUN24', value: jun24 },
    { label: 'SEP24', value: sep24 },
];

export const yieldCurveRates = [
    new Rate(37326),
    new Rate(37660),
    new Rate(38537),
    new Rate(39259),
    new Rate(42324),
    new Rate(43801),
    new Rate(46219),
    new Rate(47746),
];
