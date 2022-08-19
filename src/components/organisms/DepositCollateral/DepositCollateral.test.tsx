import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './DepositCollateral.stories';

const { Default } = composeStories(stories);

// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

const preloadedState = {
    assetPrices: {
        filecoin: {
            price: 6.0,
            change: -8.208519783216566,
        },
        ethereum: {
            price: 2000.34,
            change: 0.5162466489453748,
        },
        usdc: {
            price: 1.0,
            change: 0.042530768538486696,
        },
    },
};

describe('DepositCollateral component', () => {
    it('should display the DepositCollateral Modal when open', () => {
        render(<Default />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Deposit Collateral')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Continue');

        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should open with collateral amount 0', () => {
        render(<Default />);
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('');
        expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe(
            '0'
        );
    });

    it('should do nothing when collateral amount is 0 and continue button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        expect(onClose).not.toHaveBeenCalled();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should select asset and update amount', () => {
        render(<Default />, { preloadedState });
        fireEvent.click(screen.getByTestId('collateral-selector-button'));
        fireEvent.click(screen.getByTestId('option-1'));
        expect(screen.getByText('USDC')).toBeInTheDocument();
        expect(screen.getByText('50 USDC Available')).toBeInTheDocument();

        const tab = screen.getByTestId(75);
        fireEvent.click(tab);
        expect(screen.getByText('$37.50')).toBeInTheDocument();
    });
});
