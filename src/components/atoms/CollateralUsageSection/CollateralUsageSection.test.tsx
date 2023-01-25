import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralUsageSection.stories';

const { Default } = composeStories(stories);

describe('CollateralUsageSection Component', () => {
    it('should render a CollateralUsageSection', () => {
        render(<Default />);
    });

    it('should display the collateral usage from the prop', () => {
        render(<Default collateralCoverage={5000} />);
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should compute the available to borrow from the collateral', async () => {
        render(<Default />, { preloadedState: preloadedAssetPrices });

        expect(screen.getByText('Available to borrow')).toBeInTheDocument();
        const available = await screen.findByText('233 FIL');
        expect(available).toBeInTheDocument();
    });
});
