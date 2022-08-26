import { generateWalletInformation, WalletSource } from './currencies';
import { CurrencySymbol } from './currencyList';

describe('currencies.generateWalletInformation', () => {
    it('should return walletInformation as AssetDisclosureProps', () => {
        const addressRecord = {
            [WalletSource.METAMASK]: 'ethAccount',
            [WalletSource.LEDGER]: 'filAccount',
        };

        const balanceRecord = {
            [CurrencySymbol.ETH]: 0.58,
            [CurrencySymbol.FIL]: 150,
        };

        const options = generateWalletInformation(addressRecord, balanceRecord);
        expect(options).toHaveLength(2);
        expect(options[0]).toEqual({
            account: 'ethAccount',
            walletSource: WalletSource.METAMASK,
            data: [
                {
                    asset: CurrencySymbol.ETH,
                    quantity: 0.58,
                },
            ],
        });
        expect(options[1]).toEqual({
            account: 'filAccount',
            walletSource: WalletSource.LEDGER,
            data: [
                {
                    asset: CurrencySymbol.FIL,
                    quantity: 150,
                },
            ],
        });
    });
});
