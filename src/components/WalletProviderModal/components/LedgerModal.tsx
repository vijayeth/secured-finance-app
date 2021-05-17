import styled from 'styled-components';
import React, { useEffect } from 'react';
import Modal, { ModalProps } from '../../Modal';
import ModalTitle from '../../ModalTitle';
import { Button } from '../../common/Buttons';
import theme from '../../../theme';
import { setLedgerProvider } from '../../../services/ledger/setLedgerProvider';
import { useDispatch, useSelector } from 'react-redux';
import {
    isUsedByAnotherApp,
    isDeviceUnlocked,
} from '../../../store/ledger/selectors';
import fetchDefaultWallet from '../../../services/ledger/fetchDefaultWallet';

const getModalTextMap = (state: string) => {
    switch (state) {
        case 'hasDeviceConnectionError':
            return {
                title: 'Connection error',
                content: (
                    <>
                        <span>We couldn’t connect to your Ledger Device.</span>
                        <br />
                        <span>Please unlock your Ledger and try again.</span>
                    </>
                ),
                button: 'Try again',
            };
        case 'deviceIsConnected':
            return {
                title: 'Unlock and open',
                content:
                    'Please unlock your Ledger device and make sure the Filecoin App is open',
                button: 'My device is unlocked and Filecoin app is open',
            };
        case 'usedByAnotherApp':
            return {
                title: 'Device is used by another app',
                content: (
                    <>
                        <span>
                            Looks like another app is connected to your Ledger
                            device.
                        </span>
                        <br />
                        <span>
                            Please, disconnect the device from every other app
                            and try again
                        </span>
                    </>
                ),
                button: 'Try again',
            };
        case 'loading':
            return {
                title: 'Please wait',
                content: 'Loading...',
                button: 'Loading',
            };
        case 'finished':
            return {
                title: "You're all set",
                content: '',
                button: 'Close',
            };
        default:
            return {
                title: 'Connect',
                content: 'Please connect your Ledger to your computer',
                button: 'Yes, my device is connected',
            };
    }
};

const LedgerModal: React.FC<ModalProps & any> = ({ onClose }) => {
    const dispatch = useDispatch();
    const isDeviceUsedByAnotherApp = useSelector(isUsedByAnotherApp);
    const isUnlocked = useSelector(isDeviceUnlocked);
    const [contentState, setContentState] = React.useState('');
    const { button, content, title } = getModalTextMap(contentState);

    useEffect(() => {
        if (isDeviceUsedByAnotherApp) {
            setContentState('usedByAnotherApp');
        }
    }, [isDeviceUsedByAnotherApp]);

    useEffect(() => {
        setLedgerProvider(dispatch);
    }, []);

    const onConnectDevice = async () => {
        if (isDeviceUsedByAnotherApp) {
            setContentState('usedByAnotherApp');
        } else {
            if (contentState === 'deviceIsConnected') {
                setContentState('loading');
                const wallet = await fetchDefaultWallet(dispatch);

                if (wallet) {
                    setContentState('finished');
                }
            } else {
                if (!isUnlocked) {
                    setContentState('hasDeviceConnectionError');
                } else {
                    setContentState('deviceIsConnected');
                }
            }
        }
    };

    return (
        <Modal>
            <ModalTitle text={title} />
            <Content>{content}</Content>
            <ButtonsContainer>
                <Button onClick={onClose} outline>
                    Close
                </Button>
                <Button
                    disabled={contentState === 'loading'}
                    onClick={
                        contentState === 'finished' ? onClose : onConnectDevice
                    }
                >
                    {button}
                </Button>
            </ButtonsContainer>
        </Modal>
    );
};

const Content = styled.div`
    padding: ${theme.spacing[7]}px ${theme.spacing[4]}px 0;
    height: 84px;
    color: ${theme.colors.cellKey};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: ${theme.spacing[4]}px;
`;

export default LedgerModal;
