import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Tooltip } from './Tooltip';

const InformationCircle = (
    <button
        className='flex items-center rounded-full bg-teal p-5'
        data-testid='button-icon'
    >
        <ChevronDoubleDownIcon className='h-6 w-6 text-white' />
    </button>
);

const children = (
    <div className='text-white'>
        <p>Tooltip content</p>
    </div>
);

export default {
    title: 'Templates/Tooltip',
    component: Tooltip,
    args: {
        iconElement: InformationCircle,
        children: children,
    },
} as Meta<typeof Tooltip>;

const Template: StoryFn<typeof Tooltip> = args => (
    <div className='mx-10 w-fit'>
        <Tooltip {...args} />
    </div>
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('button-icon');
    await userEvent.hover(button);
};
