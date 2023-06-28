import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralSimulationSection.stories';

const { Trade, Unwind } = composeStories(stories);

describe('CollateralSimulationSection Component', () => {
    it('should render a CollateralSimulationSection', () => {
        render(<Trade />);
    });

    it('should display the borrow remaining and the collateral usage if its a BORROW order', () => {
        render(<Trade side={OrderSide.BORROW} />);
        expect(screen.getByText('Borrow Amount')).toBeInTheDocument();
        expect(screen.getByText('50 EFIL')).toBeInTheDocument();

        expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();
        expect(screen.getByText('$489.00')).toBeInTheDocument();

        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 98')).toBeInTheDocument();
    });

    it('should not display the borrow remaining and the collateral usage if its a LEND order', () => {
        render(<Trade side={OrderSide.LEND} />);
        expect(screen.getByText('Lend Amount')).toBeInTheDocument();
        expect(screen.getByText('50 EFIL')).toBeInTheDocument();

        expect(screen.queryByText('Borrow Remaining')).not.toBeInTheDocument();
        expect(screen.queryByText('Collateral Usage')).not.toBeInTheDocument();

        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 98')).toBeInTheDocument();
    });

    it('should display the APR when the tradeValue is provided', () => {
        render(<Trade />);
        expect(screen.getByText('APR')).toBeInTheDocument();
        expect(screen.getByText('~ 2.05%')).toBeInTheDocument();
    });

    it('should increase the collateral usage when the tradePosition is BORROW', () => {
        render(<Trade />);
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByText('37%')).toHaveClass('text-progressBarStart');
        expect(screen.getByText('58.74%')).toBeInTheDocument();
        expect(screen.getByText('58.74%')).toHaveClass('text-progressBarVia');
    });

    it('should not display the APR for an unwind', () => {
        render(<Unwind />);
        expect(screen.queryByText('APR')).not.toBeInTheDocument();
    });
});
