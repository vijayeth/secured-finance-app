import { ComponentMeta, ComponentStory } from '@storybook/react';
import { HeaderTableTab } from '.';

export default {
    title: 'Atoms/HeaderTableTab',
    component: HeaderTableTab,
    args: {
        name: 'Net APR',
        value: '$8.02',
        orientation: 'center',
    },
} as ComponentMeta<typeof HeaderTableTab>;

const Template: ComponentStory<typeof HeaderTableTab> = args => (
    <HeaderTableTab {...args} />
);

export const Default = Template.bind({});
