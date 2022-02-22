import React from 'react';
import styled from 'styled-components';
import OrderType from './components/OrderType';
import Spread from './components/Spread';
import { Type, Orders } from './types';
import { Subheader } from '../../../../components/common/Subheader';
import {
    useBorrowOrderbook,
    useLendOrderbook,
} from '../../../../hooks/useLendingOrderbook';
import { OrderbookRow } from '../../../../store/lendingTerminal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/types';

interface OrderBookProps {
    buyType: Type;
    buyOrders?: Array<OrderbookRow>;
    sellType: Type;
    sellOrders?: Array<OrderbookRow>;
}

export const OrderBook: React.FC = () => {
    const ccyIndex = useSelector(
        (state: RootState) => state.lendingTerminal.currencyIndex
    );
    const termsIndex = useSelector(
        (state: RootState) => state.lendingTerminal.termsIndex
    );
    const spread = useSelector(
        (state: RootState) => state.lendingTerminal.spread
    );
    const marketRate = useSelector(
        (state: RootState) => state.lendingTerminal.marketRate
    );

    const borrowOrderbook = useBorrowOrderbook(ccyIndex, termsIndex);
    const lendOrderbook = useLendOrderbook(ccyIndex, termsIndex);

    return (
        <StyledOrderBook>
            <Subheader>Order Book</Subheader>
            <OrderType
                type={{ side: 'lend', text: 'Lenders' }}
                showHeader={true}
                orders={lendOrderbook}
            />
            <Spread spread={spread} rate={marketRate} />
            <OrderType
                type={{ side: 'borrow', text: 'Borrowers' }}
                showHeader={false}
                orders={borrowOrderbook}
            />
        </StyledOrderBook>
    );
};

const StyledOrderBook = styled.div`
    display: grid;
`;
