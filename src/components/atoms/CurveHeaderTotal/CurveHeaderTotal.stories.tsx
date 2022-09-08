import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurveHeaderTotal } from './';

export default {
    title: 'Atoms/CurveHeaderTotal',
    component: CurveHeaderTotal,
    args: {
        header: 'Total Borrow (Asset)',
        footer: '80,000,009 FIL',
    },
} as ComponentMeta<typeof CurveHeaderTotal>;

const Template: ComponentStory<typeof CurveHeaderTotal> = args => (
    <CurveHeaderTotal {...args} />
);

export const Default = Template.bind({});

export const USD = Template.bind({});
USD.args = {
    header: 'Total Borrow (USD)',
    footer: '$650,400,073',
};
