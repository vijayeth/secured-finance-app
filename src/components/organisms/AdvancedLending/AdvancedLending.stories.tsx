import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent, within } from '@storybook/testing-library';
import { defaultDelistedStatusSet, emptyCollateralBook } from 'src/hooks';
import {
    collateralBook37,
    maturityOptions,
    yieldCurveRates,
} from 'src/stories/mocks/fixtures';
import {
    mockFilteredUserOrderHistory,
    mockFilteredUserTransactionHistory,
    mockTrades,
} from 'src/stories/mocks/queries';
import { CurrencySymbol } from 'src/utils';
import { AdvancedLending } from './AdvancedLending';

export default {
    title: 'Organism/AdvancedLending',
    component: AdvancedLending,
    args: {
        collateralBook: emptyCollateralBook,
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
        marketPrice: 9917,
        delistedCurrencySet: defaultDelistedStatusSet,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        apolloClient: {
            mocks: [
                ...mockTrades,
                ...mockFilteredUserTransactionHistory,
                ...mockFilteredUserOrderHistory,
            ],
        },
        chromatic: {
            ...RESPONSIVE_PARAMETERS.chromatic,
            delay: 5000,
        },
    },
    decorators: [withWalletProvider],
} as Meta<typeof AdvancedLending>;

const Template: StoryFn<typeof AdvancedLending> = args => {
    return <AdvancedLending {...args} />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
ConnectedToWallet.args = {
    collateralBook: collateralBook37,
};

export const OpenOrdersConnectedToWallet = Template.bind({});
OpenOrdersConnectedToWallet.parameters = {
    connected: true,
};
OpenOrdersConnectedToWallet.play = async () => {
    const openOrdersTab = screen.getByTestId('Open Orders');
    await userEvent.click(openOrdersTab);

    const dec22Btn = await screen.findByRole('button', {
        name: 'WFIL-DEC2022',
    });
    await userEvent.click(dec22Btn);

    const jun23Button = await screen.findByText('WFIL-JUN2023');
    await userEvent.click(jun23Button);
};
OpenOrdersConnectedToWallet.args = {
    collateralBook: collateralBook37,
};

export const OrderHistoryConnectedToWallet = Template.bind({});
OrderHistoryConnectedToWallet.parameters = {
    connected: true,
};
OrderHistoryConnectedToWallet.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderHistoryTab = canvas.getByTestId('Order History');
    await userEvent.click(orderHistoryTab);
};
OrderHistoryConnectedToWallet.args = {
    collateralBook: collateralBook37,
};

export const MyTransactionsConnectedToWallet = Template.bind({});
MyTransactionsConnectedToWallet.parameters = {
    connected: true,
};
MyTransactionsConnectedToWallet.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderHistoryTab = canvas.getByTestId('My Transactions');
    await userEvent.click(orderHistoryTab);
};
MyTransactionsConnectedToWallet.args = {
    collateralBook: collateralBook37,
};

export const Delisted = Template.bind({});
Delisted.parameters = {
    connected: true,
};
Delisted.args = {
    collateralBook: collateralBook37,
    delistedCurrencySet: new Set([CurrencySymbol.WFIL]),
};
