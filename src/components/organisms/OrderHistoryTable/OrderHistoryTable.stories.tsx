import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { orderHistoryList } from 'src/stories/mocks/fixtures';
import { OrderHistoryTable } from './OrderHistoryTable';

export default {
    title: 'Organism/OrderHistoryTable',
    component: OrderHistoryTable,
    args: {
        data: orderHistoryList,
    },
    decorators: [withAssetPrice],
} as ComponentMeta<typeof OrderHistoryTable>;

const Template: ComponentStory<typeof OrderHistoryTable> = args => (
    <OrderHistoryTable {...args} />
);

export const Default = Template.bind({});
