import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LiquidationProgressBar } from './LiquidationProgressBar';

export default {
    title: 'Molecules/LiquidationProgressBar',
    component: LiquidationProgressBar,
    args: {
        liquidationPercentage: 0,
        collateralThreshold: 80,
    },
} as ComponentMeta<typeof LiquidationProgressBar>;

const Template: ComponentStory<typeof LiquidationProgressBar> = args => (
    <LiquidationProgressBar {...args} />
);

export const Default = Template.bind({});
export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.args = {
    liquidationPercentage: 45,
    collateralThreshold: 80,
};
