import { BigNumber } from 'ethers';
import * as jest from 'jest-mock';

export const mockUseSF = () => {
    const mockSecuredFinance = {
        placeLendingOrder: jest.fn(),
        getBorrowUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9687),
                BigNumber.from(9685),
                BigNumber.from(9679),
                BigNumber.from(9674),
                BigNumber.from(9653),
                BigNumber.from(9643),
                BigNumber.from(9627),
                BigNumber.from(9617),
            ])
        ),
        getLendUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9685),
                BigNumber.from(9683),
                BigNumber.from(9677),
                BigNumber.from(9672),
                BigNumber.from(9651),
                BigNumber.from(9641),
                BigNumber.from(9625),
                BigNumber.from(9615),
            ])
        ),
        getMidUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9686),
                BigNumber.from(9684),
                BigNumber.from(9678),
                BigNumber.from(9673),
                BigNumber.from(9652),
                BigNumber.from(9642),
                BigNumber.from(9626),
                BigNumber.from(9616),
            ])
        ),
        getCollateralBook: jest.fn(() =>
            Promise.resolve({
                collateral: {
                    ETH: BigNumber.from('1000000000000000000'),
                    USDC: BigNumber.from('10000000'),
                },
                collateralCoverage: BigNumber.from('80'),
            })
        ),
        getLendingMarket: jest.fn(() =>
            Promise.resolve({
                contract: {
                    address: '0x0',
                },
            })
        ),

        getMaturities: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('1000'),
                BigNumber.from('2000'),
                BigNumber.from('3000'),
                BigNumber.from('4000'),
                BigNumber.from('5000'),
            ])
        ),

        getLendingMarkets: jest.fn(() =>
            Promise.resolve([
                {
                    midRate: 100,
                    lendRate: 200,
                    borrowRate: 300,
                    maturity: 1000,
                    name: 'ETH-1000',
                },
                {
                    midRate: 100,
                    lendRate: 200,
                    borrowRate: 300,
                    maturity: 2000,
                    name: 'ETH-2000',
                },
            ])
        ),

        depositCollateral: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
            })
        ),

        withdrawCollateral: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() =>
                    Promise.resolve({ blockNumber: undefined })
                ),
            })
        ),

        getBorrowOrderBook: jest.fn(() =>
            Promise.resolve({
                unitPrices: [
                    BigNumber.from(9690),
                    BigNumber.from(9687),
                    BigNumber.from(9685),
                    BigNumber.from(9679),
                    BigNumber.from(9674),
                ],
                amounts: [
                    BigNumber.from('43000000000000000000000'),
                    BigNumber.from('23000000000000000000000'),
                    BigNumber.from('15000000000000000000000'),
                    BigNumber.from('12000000000000000000000'),
                    BigNumber.from('1800000000000000000000'),
                ],
                quantities: [
                    BigNumber.from('1000'),
                    BigNumber.from('2000'),
                    BigNumber.from('3000'),
                    BigNumber.from('4000'),
                    BigNumber.from('5000'),
                ],
            })
        ),

        getLendOrderBook: jest.fn(() =>
            Promise.resolve({
                unitPrices: [
                    BigNumber.from(9690),
                    BigNumber.from(9687),
                    BigNumber.from(9685),
                    BigNumber.from(9679),
                    BigNumber.from(9674),
                ],
                amounts: [
                    BigNumber.from('43000000000000000000000'),
                    BigNumber.from('23000000000000000000000'),
                    BigNumber.from('15000000000000000000000'),
                    BigNumber.from('12000000000000000000000'),
                    BigNumber.from('1800000000000000000000'),
                ],
                quantities: [
                    BigNumber.from('1000'),
                    BigNumber.from('2000'),
                    BigNumber.from('3000'),
                    BigNumber.from('4000'),
                    BigNumber.from('5000'),
                ],
            })
        ),

        getERC20Balance: jest.fn(() => Promise.resolve({ balance: 100 })),
    };

    return mockSecuredFinance;
};
