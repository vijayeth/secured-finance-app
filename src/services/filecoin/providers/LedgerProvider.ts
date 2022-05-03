import { Network } from '@glif/filecoin-address';
import { SerializableMessage } from '@glif/filecoin-message';
import Transport from '@ledgerhq/hw-transport';
import RustModule from '@zondax/filecoin-signing-tools';
import FilecoinApp from '@zondax/ledger-filecoin';
import { mapSeries } from 'bluebird';
import createPath from 'src/services/ledger/createPath';
import { FilecoinWalletType } from '../store/types';

type Response = {
    error_message: string;
    signature_compact?: Buffer;
    addrString?: string;
};

const handleErrors: (response: Response) => Response = response => {
    if (
        response.error_message &&
        response.error_message.toLowerCase().includes('no errors')
    ) {
        return response;
    }
    if (
        response.error_message &&
        response.error_message
            .toLowerCase()
            .includes('transporterror: invalid channel')
    ) {
        throw new Error(
            'Lost connection with Ledger. Please quit the Filecoin app, and unplug/replug device.'
        );
    }
    throw new Error(response.error_message);
};

const throwIfBusy = (busy: boolean) => {
    if (busy)
        throw new Error(
            'Ledger is busy, please check device, or quit Filecoin app and unplug/replug your device.'
        );
};

const ledgerProvider = (rustModule: RustModule) => {
    return (transport: Transport) => {
        let ledgerBusy = false;
        const ledgerApp = new FilecoinApp(transport);
        return {
            type: FilecoinWalletType.Ledger,

            getVersion: () => {
                throwIfBusy(ledgerBusy);
                ledgerBusy = true;
                return new Promise((resolve, reject) => {
                    let finished = false;
                    setTimeout(() => {
                        if (!finished) {
                            finished = true;
                            ledgerBusy = false;
                            return reject(
                                new Error('Ledger device locked or busy')
                            );
                        }
                    }, 3000);

                    setTimeout(async () => {
                        try {
                            const response = handleErrors(
                                await ledgerApp.getVersion()
                            );
                            return resolve(response);
                        } catch (err) {
                            return reject(err);
                        } finally {
                            if (!finished) {
                                finished = true;
                                ledgerBusy = false;
                            }
                        }
                    });
                });
            },

            getAccounts: async (
                nStart = 0,
                nEnd = 5,
                network: Network = Network.TEST
            ) => {
                throwIfBusy(ledgerBusy);
                ledgerBusy = true;
                const paths = [];
                for (let i = nStart; i < nEnd; i += 1) {
                    paths.push(createPath(network, i));
                }
                const addresses = mapSeries(paths, async path => {
                    const { addrString } = handleErrors(
                        await ledgerApp.getAddressAndPubKey(path)
                    );
                    return addrString;
                });
                ledgerBusy = false;
                return addresses;
            },

            sign: async (
                filecoinMessage: SerializableMessage,
                path: string
            ) => {
                throwIfBusy(ledgerBusy);
                ledgerBusy = true;
                const serializedMessage: string =
                    rustModule.transactionSerialize(filecoinMessage);
                const res = handleErrors(
                    await ledgerApp.sign(
                        path,
                        Buffer.from(serializedMessage, 'hex')
                    )
                );
                ledgerBusy = false;
                return res.signature_compact.toString('base64');
            },

            showAddressAndPubKey: async (path: string) => {
                throwIfBusy(ledgerBusy);
                ledgerBusy = true;
                const res = handleErrors(
                    await ledgerApp.showAddressAndPubKey(path)
                );
                ledgerBusy = false;
                return res;
            },
        };
    };
};

export default ledgerProvider;
