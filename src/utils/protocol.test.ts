import { fromBytes32 } from '@secured-finance/sf-graph-client';
import {
    assetPriceMap,
    dailyVolumes,
    dec22Fixture,
    usdcBytes32,
} from 'src/stories/mocks/fixtures';
import { ZERO_BI } from './collateral';
import { createCurrencyMap } from './currencyList';
import { computeTotalDailyVolumeInUSD } from './protocol';

describe('computeTotalDailyVolumeInUSD', () => {
    it('should return 0 if no daily volumes', () => {
        const expectedVolumes = createCurrencyMap<bigint>(ZERO_BI);

        expect(computeTotalDailyVolumeInUSD([], assetPriceMap)).toEqual({
            totalVolumeUSD: ZERO_BI,
            volumePerCurrency: expectedVolumes,
            volumePerMarket: {},
        });
    });

    it('should compute total daily volume in USD', () => {
        dailyVolumes.push({
            id: `${fromBytes32(usdcBytes32)}-1677628800-2023-02-2`,
            currency: usdcBytes32,
            maturity: dec22Fixture,
            day: `2023-02-2`,
            timestamp: dec22Fixture.toString(),
            volume: '30000000',
        });
        const expectedVolumes = createCurrencyMap<bigint>(ZERO_BI);
        expectedVolumes.USDC = BigInt(30);
        expectedVolumes.WFIL = BigInt(657000);

        expect(
            computeTotalDailyVolumeInUSD(dailyVolumes, assetPriceMap)
        ).toEqual({
            totalVolumeUSD: BigInt(3942030),
            volumePerCurrency: expectedVolumes,
            volumePerMarket: {
                'WFIL-1669852800': BigInt(3942000),
                'USDC-1669852800': BigInt(30),
            },
        });
    });
});
