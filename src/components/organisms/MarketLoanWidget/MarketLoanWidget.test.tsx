import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketLoanWidget.stories';

const { Default } = composeStories(stories);

describe('MarketLoanWidget Component', () => {
    it('should render a MarketLoanWidget', () => {
        render(<Default />);
    });

    it('should filter by currency', () => {
        render(<Default />);
        expect(screen.queryByText('WBTC')).toBeInTheDocument();
        screen.getByRole('button', { name: 'All Assets' }).click();
        screen.getByRole('menuitem', { name: 'EFIL' }).click();
        expect(screen.queryByText('WBTC')).not.toBeInTheDocument();
    });

    it('should filter by maturity', () => {
        render(<Default />);
        expect(screen.getAllByText('Dec 1, 2022').length).toEqual(2);
        screen.getByRole('button', { name: 'DEC22' }).click();
        screen.getByRole('menuitem', { name: 'JUN23' }).click();
        expect(screen.queryByText('Dec 1, 2022')).not.toBeInTheDocument();
        expect(screen.getAllByText('Jun 1, 2023').length).toEqual(2);
    });

    it('should dedupe maturity', () => {
        render(<Default />);
        screen.getByRole('button', { name: 'DEC22' }).click();
        expect(screen.getAllByRole('menuitem').length).toBe(3);
    });
});
