import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './TableHeader.stories';

const { Default, Sorting, TitleHint } = composeStories(stories);

describe('TableHeader Component', () => {
    it('should render a TableHeader', () => {
        render(<Default />);
    });

    it('should be clickable', () => {
        render(<Default />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('should not display a sort icon by default', () => {
        render(<Default />);
        expect(screen.queryByTestId('sorting-icons')).not.toBeInTheDocument();
    });

    it('should display the arrows when it is a sorting header', () => {
        render(<Sorting />);
        expect(screen.getByTestId('sorting-icons')).toBeInTheDocument();
    });

    it('should align the text to the right when align is right', () => {
        render(<Default align='right' />);
        expect(screen.getByTestId('table-header-wrapper')).toHaveClass(
            'justify-end'
        );
    });

    it('should not wrap the component in a div when align is not provided', () => {
        render(<Default />);
        expect(
            screen.queryByTestId('table-header-wrapper')
        ).not.toBeInTheDocument();
    });

    it('should display title hint on mouse enter', () => {
        render(<TitleHint />);
        const button = screen.getByRole('button');
        fireEvent.mouseEnter(button);

        expect(screen.getByText('This is a title hint.')).toBeInTheDocument();
    });

    it('should not display title hint on mouse out', () => {
        render(<TitleHint />);
        const button = screen.getByRole('button');
        fireEvent.mouseEnter(button);
        fireEvent.mouseOut(button);

        expect(
            screen.queryByText('This is a title hint.')
        ).not.toBeInTheDocument();
    });
});
