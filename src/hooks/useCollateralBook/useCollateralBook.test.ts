import { BigNumber } from 'ethers';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { act, renderHook } from 'src/test-utils';
import { amountFormatterFromBase, CurrencySymbol } from 'src/utils';
import { CollateralBook, useCollateralBook } from './';

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('useCollateralBook hook', () => {
    const ETH_PRICE = 2000.34;
    const USDC_PRICE = 1;
    const preloadedState = {
        ...preloadedAssetPrices,
    };
    it('should return the collateral book for an user', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCollateralBook('0x0')
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        const colBook = result.current as CollateralBook;
        expect(colBook.collateral.ETH).toEqual(
            BigNumber.from('1000000000000000000')
        );
    });

    it('should return the empty book when given an null user', async () => {
        const { result } = renderHook(() => useCollateralBook(null));
        const colBook = result.current as CollateralBook;
        expect(colBook.collateral.ETH).toEqual(BigNumber.from('0'));
    });

    it('should compute the collaterals in USD', async () => {
        const { result, waitForNextUpdate } = renderHook(
            () => useCollateralBook('0x0'),
            { preloadedState }
        );
        await act(async () => {
            await waitForNextUpdate();
        });
        const colBook = result.current as CollateralBook;
        expect(colBook.usdCollateral.toString()).toEqual(
            (
                amountFormatterFromBase[CurrencySymbol.ETH](
                    colBook.collateral.ETH ?? BigNumber.from(0)
                ) *
                    ETH_PRICE +
                amountFormatterFromBase[CurrencySymbol.USDC](
                    colBook.collateral.USDC ?? BigNumber.from(0)
                ) *
                    USDC_PRICE
            ).toString()
        );
    });
});
