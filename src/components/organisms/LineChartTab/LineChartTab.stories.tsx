import type { Meta, StoryFn } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { yieldCurveRates } from 'src/stories/mocks/fixtures';
import { LineChartTab } from './LineChartTab';

const maturityList = [
    { label: 'DEC22', maturity: 1669852800, isPreOrderPeriod: true },
    { label: 'MAR23', maturity: 1677628800, isPreOrderPeriod: true },
    { label: 'JUN23', maturity: 1685577600, isPreOrderPeriod: true },
    { label: 'SEP23', maturity: 1693526400, isPreOrderPeriod: true },
    { label: 'DEC23', maturity: 1701388800, isPreOrderPeriod: true },
    { label: 'MAR24', maturity: 1709251200, isPreOrderPeriod: true },
    { label: 'JUN24', maturity: 1717200000, isPreOrderPeriod: true },
    { label: 'SEP24', maturity: 1733011200, isPreOrderPeriod: true },
];

export default {
    title: 'Organism/LineChartTab',
    component: LineChartTab,
    args: {
        rates: yieldCurveRates,
        maturityList: maturityList,
        itayoseMarketIndexSet: new Set(),
    },
    chromatic: { pauseAnimationAtEnd: true },
    decorators: [withWalletProvider, withAssetPrice],
} as Meta<typeof LineChartTab>;

const Template: StoryFn<typeof LineChartTab> = args => {
    return (
        <div className='h-[410px] w-full px-6 py-4'>
            <LineChartTab {...args} />
        </div>
    );
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};

export const WithItayoseMarket = Template.bind({});
WithItayoseMarket.args = {
    itayoseMarketIndexSet: new Set([7]),
};

export const MultipleItayoseMarkets = Template.bind({});
MultipleItayoseMarkets.args = {
    itayoseMarketIndexSet: new Set([5, 6, 7]),
};
