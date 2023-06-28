import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withAssetPrice, withWalletProvider } from '.storybook/decorators';
import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    collateralBook37,
    dec22Fixture,
    maturityOptions,
} from 'src/stories/mocks/fixtures';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { PlaceOrder } from './PlaceOrder';

export default {
    title: 'Organism/PlaceOrder',
    component: PlaceOrder,
    args: {
        isOpen: true,
        onClose: () => {},
        collateral: collateralBook37,
        loanValue: LoanValue.fromPrice(9410, dec22Fixture.toNumber()),
        orderAmount: new Amount('100000000', CurrencySymbol.USDC),
        maturity: dec22Fixture,
        orderType: OrderType.LIMIT,
        side: OrderSide.BORROW,
        assetPrice: 6.12,
        walletSource: WalletSource.METAMASK,
        maturitiesOptionList: maturityOptions,
    },
    decorators: [withAssetPrice, withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as ComponentMeta<typeof PlaceOrder>;

const Template: ComponentStory<typeof PlaceOrder> = args => {
    return <PlaceOrder {...args} />;
};

export const Default = Template.bind({});
