import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MarketTab } from '.';

export default {
    title: 'Atoms/MarketTab',
    component: MarketTab,
    args: {
        name: '24h High',
        value: 0.7787,
    },
} as ComponentMeta<typeof MarketTab>;

const Template: ComponentStory<typeof MarketTab> = args => (
    <MarketTab {...args} />
);

export const Default = Template.bind({});

export const GreenMarketTab = Template.bind({});
GreenMarketTab.args = { name: 0.7977, value: '25.00% APY' };
