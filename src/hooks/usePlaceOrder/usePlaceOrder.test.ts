import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { renderHook } from '@testing-library/react-hooks';
import { BigNumber } from 'ethers';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { currencyMap, CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { usePlaceOrder } from './';

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

beforeEach(() => {
    mockSecuredFinance.placeLendingOrder.mockReset();
});

describe('usePlaceOrder hook', () => {
    it('should return the placeOrder function', () => {
        const { result } = renderHook(() => usePlaceOrder());
        expect(result.current.placeOrder).toBeInstanceOf(Function);
    });

    it('should call the SDK in wei when used with ETH', async () => {
        const { result } = renderHook(() => usePlaceOrder());
        const placeOrder = result.current.placeOrder;
        await placeOrder(
            CurrencySymbol.ETH,
            new Maturity(2022),
            Side.LEND,
            currencyMap.ETH.toBaseUnit(1),
            9863
        );
        expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledTimes(1);
        expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.ETH),
            2022,
            '0',
            BigNumber.from('1000000000000000000'),
            9863
        );
    });

    it('should call the sdk with a price of 0 when not provided', async () => {
        const { result } = renderHook(() => usePlaceOrder());
        const placeOrder = result.current.placeOrder;
        await placeOrder(
            CurrencySymbol.ETH,
            new Maturity(2022),
            Side.LEND,
            currencyMap.ETH.toBaseUnit(1)
        );

        expect(mockSecuredFinance.placeLendingOrder).toHaveBeenCalledWith(
            toCurrency(CurrencySymbol.ETH),
            2022,
            '0',
            BigNumber.from('1000000000000000000'),
            undefined
        );
    });
});
