import type { Meta, StoryFn } from '@storybook/react';
import { Tab } from './Tab';

export default {
    title: 'Molecules/Tab',
    component: Tab,
    args: {
        tabDataArray: [
            { text: 'Tab A' },
            { text: 'Tab B' },
            { text: 'Tab C', disabled: true },
        ],
    },
} as Meta<typeof Tab>;

const Template: StoryFn<typeof Tab> = args => (
    <div className='h-[400px] w-[600px] text-white-80'>
        <Tab {...args}>
            <p>Tab A Content</p>
            <p>Tab B Content</p>
            <p>Tab C Content</p>
        </Tab>
    </div>
);

export const Default = Template.bind({});
export const WithUtils = Template.bind({});
WithUtils.args = {
    tabDataArray: [
        {
            text: 'Tab A',
            util: (
                <div
                    key={1}
                    className='flex flex-row items-center justify-center'
                >
                    <p>Util A</p>
                    <p>Util A</p>
                </div>
            ),
        },
        { text: 'Tab B', util: <div key={3}>Util B</div> },
        { text: 'Tab C', disabled: true },
    ],
};
