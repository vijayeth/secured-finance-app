import mockDate from 'mockdate';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { renderHook } from 'src/test-utils';
import { CurrencySymbol } from 'src/utils';
import { useOrderbook } from './useOrderbook';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

beforeAll(() => {
    mockDate.reset();
    mockDate.set('2022-12-01T11:00:00.00Z');
});

describe('useOrderbook', () => {
    it('should return an array of number for borrow rates', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useOrderbook(CurrencySymbol.ETH, 1, 5)
        );

        expect(result.current).toEqual({
            borrowOrderbook: [],
            lendOrderbook: [],
        });

        await waitForNextUpdate();

        expect(result.current.borrowOrderbook.length).toBe(5);
    });
});
