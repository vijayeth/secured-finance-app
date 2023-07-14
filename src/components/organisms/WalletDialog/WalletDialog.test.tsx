import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './WalletDialog.stories';

const { Primary } = composeStories(stories);

const preloadedState = {
    interactions: {
        walletDialogOpen: true,
    },
    blockchain: {
        chainError: false,
    },
};

describe('Wallet Dialog component', () => {
    it('should display the wallet radio group in a modal at open', () => {
        render(<Primary />, { preloadedState });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Select Wallet Provider')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Connect Wallet');

        expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('should open with nothing selected', () => {
        render(<Primary />, { preloadedState });
        screen.getAllByRole('radio').forEach(radio => {
            expect(radio).toHaveAttribute('aria-checked', 'false');
        });
    });

    it('should do nothing when no option is selected and button is clicked', () => {
        render(<Primary />, { preloadedState });

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        expect(screen.getAllByRole('radio')).toHaveLength(2);
    });
});
