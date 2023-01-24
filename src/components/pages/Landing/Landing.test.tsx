import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Landing.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

describe('Landing Component', () => {
    it('should render a Landing', () => {
        render(<Default />);
    });

    it('should change the rate when the user changes the maturity', () => {
        render(<Default />);
        waitFor(() => {
            expect(screen.getByTestId('rate')).toHaveTextContent('1%');
        });

        waitFor(() => {
            fireEvent.click(screen.getByText('MAR22'));
            fireEvent.click(screen.getByText('DEC22'));
        });

        waitFor(() => {
            expect(screen.getByTestId('rate')).toHaveTextContent('2%');
        });
    });

    it('should select the market order type when the user change to advance mode', async () => {
        waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });

        expect(screen.getByRole('radio', { name: 'Market' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Limit' })).not.toBeChecked();
    });
});
