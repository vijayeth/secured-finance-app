import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CurrencyIcon } from './CurrencyIcon';

export default {
    title: 'Atoms/CurrencyIcon',
    component: CurrencyIcon,
    args: { ccy: CurrencySymbol.FIL },
    argTypes: {
        ccy: {
            control: {
                type: 'select',
                options: Object.values(CurrencySymbol),
            },
        },
        variant: {
            control: {
                type: 'select',
                options: ['default', 'large'],
            },
        },
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof CurrencyIcon>;

const Template: ComponentStory<typeof CurrencyIcon> = args => (
    <CurrencyIcon {...args} />
);

export const Default = Template.bind({});
export const Large = Template.bind({});
Large.args = { variant: 'large' };
