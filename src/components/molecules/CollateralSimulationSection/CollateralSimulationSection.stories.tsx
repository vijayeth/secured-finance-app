import { OrderSide } from '@secured-finance/sf-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { CollateralSimulationSection } from './CollateralSimulationSection';

export default {
    title: 'Organism/CollateralSimulationSection',
    component: CollateralSimulationSection,
    args: {
        collateral: collateralBook37,
        tradeAmount: new Amount('5000000000000000000', CurrencySymbol.EFIL),
        tradePosition: OrderSide.BORROW,
        assetPrice: 8,
        type: 'trade',
        collateralThreshold: 80,
    },
} as ComponentMeta<typeof CollateralSimulationSection>;

const Template: ComponentStory<typeof CollateralSimulationSection> = args => (
    <CollateralSimulationSection {...args} />
);

export const Trade = Template.bind({});
export const Unwind = Template.bind({});
Unwind.args = {
    type: 'unwind',
    collateralThreshold: 80,
};
