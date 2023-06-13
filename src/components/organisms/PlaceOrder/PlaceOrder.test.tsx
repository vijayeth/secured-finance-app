import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { dec22Fixture, preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import * as stories from './PlaceOrder.stories';

const { Default, MarketOrder } = composeStories(stories);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        maturity: 0,
        side: OrderSide.BORROW,
        amount: '500000000',
        unitPrice: 0,
        orderType: OrderType.LIMIT,
        sourceAccount: WalletSource.METAMASK,
    },
    ...preloadedAssetPrices,
};

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('PlaceOrder component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        window.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });

    it('should display the Place Order Modal when open', () => {
        render(<Default />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
    });

    it('should display all the fields in Limit order', () => {
        render(<Default />);
        expect(screen.queryByText('Bond Price')).not.toBeInTheDocument();
        expect(screen.queryByText('Loan Start Date')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Loan Maturity Date')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Total Interest (USD)')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Est. Total Debt (USD)')
        ).not.toBeInTheDocument();
        const button = screen.getByText('Additional Information');
        fireEvent.click(button);
        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('Loan Start Date')).toBeInTheDocument();
        expect(screen.getByText('Loan Maturity Date')).toBeInTheDocument();
        expect(screen.getByText('Total Interest (USD)')).toBeInTheDocument();
        expect(screen.getByText('Est. Total Debt (USD)')).toBeInTheDocument();
    });

    it('should render collateral utilization and not Borrow remaining in lend orders', () => {
        render(<Default side={OrderSide.LEND} />);
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.queryByText('Borrow Remaining')).not.toBeInTheDocument();
    });

    it('should render collateral utilization and borrow remaining in borrow orders', () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    ...preloadedState.landingOrderForm,
                    side: OrderSide.BORROW,
                },
            },
        });
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.queryByText('Borrow Remaining')).toBeInTheDocument();
    });

    it(' should display Est. Total Loan value (USD) instead of Est. Total Debt (USD) in lend orders when order type is LIMIT', () => {
        render(<Default side={OrderSide.LEND} />);
        expect(screen.queryByText('Bond Price')).not.toBeInTheDocument();
        expect(screen.queryByText('Loan Start Date')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Loan Maturity Date')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Total Interest (USD)')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Est. Total Debt (USD)')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Est. Total Loan value (USD)')
        ).not.toBeInTheDocument();
        const button = screen.getByText('Additional Information');
        fireEvent.click(button);
        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('Loan Start Date')).toBeInTheDocument();
        expect(screen.getByText('Loan Maturity Date')).toBeInTheDocument();
        expect(screen.getByText('Total Interest (USD)')).toBeInTheDocument();
        expect(
            screen.queryByText('Est. Total Debt (USD)')
        ).not.toBeInTheDocument();
        expect(
            screen.getByText('Est. Total Loan value (USD)')
        ).toBeInTheDocument();
    });

    it(' should only display Loan Maturity date in Market Order', () => {
        render(<MarketOrder />);
        expect(screen.queryByText('Bond Price')).not.toBeInTheDocument();
        expect(screen.queryByText('Loan Start Date')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Loan Maturity Date')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Total Interest (USD)')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Est. Total Debt (USD)')
        ).not.toBeInTheDocument();
        const button = screen.getByText('Additional Information');
        fireEvent.click(button);
        expect(screen.queryByText('Bond Price')).not.toBeInTheDocument();
        expect(screen.queryByText('Loan Start Date')).not.toBeInTheDocument();
        expect(screen.getByText('Loan Maturity Date')).toBeInTheDocument();
        expect(
            screen.queryByText('Total Interest (USD)')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByText('Est. Total Debt (USD)')
        ).not.toBeInTheDocument();
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown;
        const onPlaceOrder = jest.fn().mockReturnValue(Promise.resolve(tx));

        render(<Default onClose={onClose} onPlaceOrder={onPlaceOrder} />, {
            preloadedState,
        });
        fireEvent.click(screen.getByTestId('dialog-action-button'));

        await waitFor(() =>
            expect(screen.getByText('Success!')).toBeInTheDocument()
        );

        await waitFor(() =>
            expect(
                screen.getByText('Your transaction request was successful.')
            ).toBeInTheDocument()
        );

        await waitFor(() => expect(onClose).not.toHaveBeenCalled());
    });

    it('should write an error in the store and proceed to failure screen if onPlaceOrder throw an error', async () => {
        const onPlaceOrder = jest.fn(() => {
            throw new Error('This is an error');
        });
        const { store } = render(<Default onPlaceOrder={onPlaceOrder} />);
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(store.getState().lastError.lastMessage).toEqual(
                'This is an error'
            )
        );
        expect(screen.getByText('Failed!')).toBeInTheDocument();
        expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    it('should call the onPlaceOrder function in market order mode if the orderType is MARKET', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown;
        const onPlaceOrder = jest.fn().mockReturnValue(Promise.resolve(tx));
        render(
            <MarketOrder
                onPlaceOrder={onPlaceOrder}
                orderType={OrderType.MARKET}
            />,
            { preloadedState }
        );
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith(
                CurrencySymbol.USDC,
                dec22Fixture,
                OrderSide.BORROW,
                BigNumber.from('1000000000'),
                0,
                WalletSource.METAMASK
            )
        );
    });

    it('should call the onPlaceOrder function in limit order mode if the orderType is LIMIT', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown;
        const onPlaceOrder = jest.fn().mockReturnValue(Promise.resolve(tx));
        render(
            <Default onPlaceOrder={onPlaceOrder} orderType={OrderType.LIMIT} />,
            { preloadedState }
        );
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith(
                CurrencySymbol.USDC,
                dec22Fixture,
                OrderSide.BORROW,
                BigNumber.from('1000000000'),
                9410,
                WalletSource.METAMASK
            )
        );
    });

    it('should raise an error if the order price is missing but we are in a limit order mode', async () => {
        const onPlaceOrder = jest.fn();
        const spy = jest.spyOn(console, 'error').mockImplementation();
        render(<MarketOrder onPlaceOrder={onPlaceOrder} />, {
            preloadedState,
        });
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() => expect(spy).toHaveBeenCalled());
        await waitFor(() => expect(onPlaceOrder).not.toHaveBeenCalled());
    });
});
