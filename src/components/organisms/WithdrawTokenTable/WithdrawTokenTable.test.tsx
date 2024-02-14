import { composeStories } from '@storybook/react';
import { act, render, screen } from 'src/test-utils.js';
import * as stories from './WithdrawTokenTable.stories';

const { Default } = composeStories(stories);

describe('WithdrawTokenTable Component', () => {
    it('should render a WithdrawTokenTable', () => {
        render(<Default />);
    });

    it('should open the withdraw modal when the withdraw button is clicked', () => {
        render(<Default />);
        act(() =>
            screen.getAllByRole('button', { name: 'Withdraw' })[0].click()
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open the withdraw modal with the selected currency as default', () => {
        render(<Default />);
        act(() =>
            screen.getAllByRole('button', { name: 'Withdraw' })[0].click()
        );
        expect(screen.getByText('400 Filecoin Available')).toBeInTheDocument();
        act(() => screen.getByRole('button', { name: 'Cancel' }).click());
        act(() =>
            screen.getAllByRole('button', { name: 'Withdraw' })[1].click()
        );
        expect(screen.getByText('500 Ether Available')).toBeInTheDocument();
    });
});
