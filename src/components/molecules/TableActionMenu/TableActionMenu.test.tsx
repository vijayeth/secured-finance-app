import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './TableActionMenu.stories';

const { Default } = composeStories(stories);

describe('TableActionMenu Component', () => {
    it('should render a TableActionMenu', () => {
        render(<Default />);
    });

    it('should call the onClick argument when clicked', () => {
        const onClick = jest.fn();
        render(<Default items={[{ text: 'test', onClick: onClick }]} />);

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('test'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should render a disabled button if disabled is true', async () => {
        render(<Default />);
        waitFor(() => {
            const button = screen.getByText('disabled');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('text-slateGray');
        });
    });

    it('should render the first action as a primary button and thee second action as a secondary one', () => {
        const onClick = jest.fn();

        render(
            <Default
                items={[
                    { text: 'primary', onClick: onClick },
                    { text: 'secondary', onClick: onClick },
                ]}
            />
        );
        expect(screen.getByRole('button', { name: 'primary' })).toHaveClass(
            'bg-starBlue'
        );
        expect(
            screen.getByRole('button', { name: 'secondary' })
        ).not.toHaveClass('bg-starBlue');
    });
});
