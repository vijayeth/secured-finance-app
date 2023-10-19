import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { defaultDelistedStatusSet } from 'src/hooks';
import { positions, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { CurrencySymbol, getTimestampRelativeToNow } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { ActiveTradeTable } from './ActiveTradeTable';

export default {
    title: 'Organism/ActiveTradeTable',
    component: ActiveTradeTable,
    args: {
        data: positions,
        delistedCurrencySet: defaultDelistedStatusSet,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET, VIEWPORTS.LAPTOP],
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as Meta<typeof ActiveTradeTable>;

const Template: StoryFn<typeof ActiveTradeTable> = args => {
    args.data = [
        ...args.data,
        {
            amount: BigNumber.from('500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(
                getTimestampRelativeToNow(22, true)
            ).toString(),
            marketPrice: BigNumber.from(10000),
        },
        {
            amount: BigNumber.from('500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(
                getTimestampRelativeToNow(28, true)
            ).toString(),
            marketPrice: BigNumber.from(10000),
        },
        {
            amount: BigNumber.from('-500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('-500000000000000000000'),
            maturity: new Maturity(getTimestampRelativeToNow(120)).toString(),
            marketPrice: BigNumber.from(10000),
        },
        {
            amount: BigNumber.from('-500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('-500000000000000000000'),
            maturity: new Maturity(getTimestampRelativeToNow(200)).toString(),
            marketPrice: BigNumber.from(10000),
        },
        {
            amount: BigNumber.from('500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(getTimestampRelativeToNow(168)).toString(),
            marketPrice: BigNumber.from(10000),
        },
        {
            amount: BigNumber.from('500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(getTimestampRelativeToNow(200)).toString(),
            marketPrice: BigNumber.from(10000),
        },
    ];

    return <ActiveTradeTable {...args} />;
};

export const Default = Template.bind({});

export const Delisted = Template.bind({});
Delisted.args = {
    delistedCurrencySet: new Set([CurrencySymbol.WFIL]),
};
