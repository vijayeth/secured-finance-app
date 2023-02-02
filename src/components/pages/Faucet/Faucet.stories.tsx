import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAppLayout,
    withAssetPrice,
    withWalletBalances,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Faucet } from './Faucet';

export default {
    title: 'Pages/Faucet',
    component: Faucet,
    args: {},
    decorators: [
        withAppLayout,
        withWalletBalances,
        withAssetPrice,
        withWalletProvider,
    ],
} as ComponentMeta<typeof Faucet>;

const Template: ComponentStory<typeof Faucet> = () => <Faucet />;

export const Default = Template.bind({});
export const Connected = Template.bind({});
Connected.parameters = {
    connected: true,
};
