import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { collateralBook37, emptyBook } from 'src/stories/mocks/fixtures';
import { CollateralTabRightPane } from './CollateralTabRightPane';

export default {
    title: 'Molecules/CollateralTabRightPane',
    component: CollateralTabRightPane,
    args: {
        account: 'as',
        collateralBook: collateralBook37,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof CollateralTabRightPane>;

const Template: ComponentStory<typeof CollateralTabRightPane> = args => {
    return <CollateralTabRightPane {...args} />;
};

export const Default = Template.bind({});
export const NotConnectedToWallet = Template.bind({});
NotConnectedToWallet.args = {
    account: undefined,
    collateralBook: emptyBook,
};
