import React, { useCallback, useState } from 'react';
import Chip from 'src/components/atoms/Chip/Chip';
import {
    CollateralModal,
    DepositCollateral,
    SendModal,
    WalletAccountModal,
    WalletProviderModal,
} from 'src/components/organisms';
import { useCheckCollateralBook } from 'src/hooks';
import useModal from 'src/hooks/useModal';
import { supportedCoins } from 'src/store/wallets/types';
import { getCurrencyByIndex } from 'src/utils/currencyList';
import { useWallet } from 'use-wallet';

export interface ActionProps {
    callbackMap?: {
        send?: () => void;
        signOut?: () => void;
        placeCollateral?: () => void;
    };
    ccyIndex: number;
}

const RenderActions: React.FC<ActionProps> = ({ callbackMap, ccyIndex }) => {
    const [onPresentSettingsModal] = useModal(
        <WalletAccountModal ccyIndex={ccyIndex} />
    );
    const [onPresentSendModal] = useModal(
        <SendModal currencyInfo={getCurrencyByIndex(ccyIndex)} />
    );
    const { account } = useWallet();
    const status = useCheckCollateralBook(account);
    const [isOpen, setOpen] = useState(false);
    const [onPresentCollateralModal] = useModal(
        <CollateralModal ccyIndex={ccyIndex} status={status} />
    );

    const [onPresentWalletEthProviderModal] = useModal(
        <WalletProviderModal ccyIndex={ccyIndex} />,
        'provider'
    );

    const handleConnectWallet = useCallback(() => {
        onPresentWalletEthProviderModal();
    }, [onPresentWalletEthProviderModal]);

    const coin = supportedCoins[ccyIndex];

    return (
        <div>
            {callbackMap?.send &&
            callbackMap?.placeCollateral &&
            callbackMap?.signOut ? (
                <div className='flex flex-row items-center justify-evenly'>
                    <Chip
                        onClick={onPresentSendModal}
                        text='Send'
                        dataCy={`${coin}-send-chip`}
                    />
                    {ccyIndex === 0 ? (
                        <Chip
                            onClick={() => setOpen(true)}
                            text='Manage Collateral'
                            dataCy='manage-collateral-chip'
                        />
                    ) : null}
                    <Chip
                        onClick={onPresentSettingsModal}
                        text='Settings'
                        dataCy={`${coin}-settings-chip`}
                    />
                    <DepositCollateral
                        isOpen={isOpen}
                        onClose={() => setOpen(false)}
                    ></DepositCollateral>
                </div>
            ) : (
                <div className='flex flex-row items-center justify-evenly'>
                    <Chip
                        onClick={handleConnectWallet}
                        text='Connect Wallet'
                        dataCy={`${coin}-connect-wallet-chip`}
                    />
                </div>
            )}
        </div>
    );
};

export default RenderActions;
