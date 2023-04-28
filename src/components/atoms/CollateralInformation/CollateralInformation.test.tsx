import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralInformation.stories';

const { Default } = composeStories(stories);

describe('test CollateralInformation component', () => {
    it('should render CollateralInformation', () => {
        render(<Default />);
        expect(screen.getByText('ETH')).toBeInTheDocument();
        expect(screen.getByText('Ether')).toBeInTheDocument();
        expect(screen.getByText('1.2 ETH')).toBeInTheDocument();
    });
});
