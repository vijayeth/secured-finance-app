import { BigNumber } from 'ethers';
import {
    formatCollateralRatio,
    formatTimestamp,
    formatTimestampWithMonth,
    formatWithCurrency,
    ordinaryFormat,
    usdFormat,
} from './formatNumbers';

describe('formatWithCurrency', () => {
    it('should format the number with the given currency and decimals', () => {
        expect(formatWithCurrency(123456789, 'USD')).toEqual('123,456,789 USD');
        expect(formatWithCurrency(123456789, 'USD', 0)).toEqual(
            '123,456,789 USD'
        );
        expect(formatWithCurrency(123456789.123, 'EUR', 3)).toEqual(
            '123,456,789.123 EUR'
        );
        expect(formatWithCurrency(BigInt(123456789), 'JPY')).toEqual(
            '123,456,789 JPY'
        );
    });
});

describe('usdFormat', () => {
    it('formats a number as USD currency with the default parameters', () => {
        const number = 123456.789;
        const result = usdFormat(number);
        expect(result).toBe('$123,457');
    });

    it('formats a number as USD currency with specified number of fraction digits', () => {
        const number = 123456.789;
        const digits = 2;
        const result = usdFormat(number, digits);
        expect(result).toBe('$123,456.79');
    });

    it('formats a number as USD currency with specified notation', () => {
        const number = 123456.789;
        const notation = 'compact';
        const result = usdFormat(number, 0, notation);
        expect(result).toBe('$123K');
    });

    it('formats a BigNumber as USD currency with the default parameters', () => {
        const number = BigNumber.from('123456789123456789');
        const result = usdFormat(number);
        expect(result).toBe('$123,456,789,123,456,789');
    });

    it('formats a BigNumber as USD currency with specified number with a compact notation', () => {
        const number = BigNumber.from('123456789123');
        const digits = 0;
        const notation = 'compact';
        const result = usdFormat(number, digits, notation);
        expect(result).toBe('$123B');
    });
});

describe('ordinaryFormat', () => {
    it('should format a regular number with default decimals and notation', () => {
        expect(ordinaryFormat(1234.567)).toEqual('1,234.57');
    });

    it('should format a regular number with custom decimals and standard notation', () => {
        expect(ordinaryFormat(1234.567, 0, 3)).toEqual('1,234.567');
    });

    it('should format a regular number with custom decimals and compact notation', () => {
        expect(ordinaryFormat(1234.567, 0, 2, 'compact')).toEqual('1.23K');
    });

    it('should format a BigInt with default decimals and notation', () => {
        expect(ordinaryFormat(BigNumber.from(123456789))).toEqual(
            '123,456,789'
        );
    });

    it('should format a BigNumber with default decimals and notation', () => {
        expect(ordinaryFormat(BigNumber.from(1234567))).toEqual('1,234,567');
    });

    it('should format a regular number with min and max decimals', () => {
        expect(ordinaryFormat(1234.567, 0, 2)).toEqual('1,234.57');
        expect(ordinaryFormat(1234.567, 0, 4)).toEqual('1,234.567');
        expect(ordinaryFormat(1234.567, 4, 4)).toEqual('1,234.5670');
        expect(ordinaryFormat(1234.567, 6, 6)).toEqual('1,234.567000');
    });

    it('should throw an error if the min decimals is greater than the max decimals', () => {
        expect(() => ordinaryFormat(1234.567, 4, 2)).toThrow();
    });
});

describe('formatCollateralRatio', () => {
    it('should format the collateral ratio', () => {
        expect(formatCollateralRatio(10000)).toEqual('100%');
        expect(formatCollateralRatio(1000)).toEqual('10%');
        expect(formatCollateralRatio(100)).toEqual('1%');
        expect(formatCollateralRatio(10)).toEqual('0.1%');
        expect(formatCollateralRatio(1)).toEqual('0.01%');
    });
});

describe('formatTimestamp', () => {
    it('should format a timestamp in user timezone', () => {
        jest.spyOn(window.navigator, 'language', 'get').mockReturnValue(
            'en-GB'
        );
        expect(formatTimestamp(0)).toEqual('01/01/1970 05:30:00');
        expect(formatTimestamp(86400)).toEqual('02/01/1970 05:30:00');
        expect(formatTimestamp(1671859344)).toEqual('24/12/2022 10:52:24');
    });
});

describe('formatTimestampWithMonth', () => {
    it('should format a timestamp in utc timezone with month details', () => {
        expect(formatTimestampWithMonth(0)).toEqual('Jan 1, 1970 00:00:00');
        expect(formatTimestampWithMonth(86400)).toEqual('Jan 2, 1970 00:00:00');
        expect(formatTimestampWithMonth(1671859344)).toEqual(
            'Dec 24, 2022 05:22:24'
        );
    });
});
