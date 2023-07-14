import { init } from '@amplitude/analytics-browser';
import { LogLevel } from '@amplitude/analytics-types';
import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getEthereumNetwork,
    getWalletConnectId,
} from 'src/utils';
import { WagmiConfig, configureChains, createConfig, sepolia } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '../assets/css/index.css';

const projectId = getWalletConnectId();

init(getAmplitudeApiKey(), undefined, {
    appVersion: process.env.SF_ENV,
    logLevel: LogLevel.None,
});

const { chains, publicClient } = configureChains(
    [sepolia],
    [
        alchemyProvider({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
        }),
        publicProvider(),
    ]
);

const config = createConfig({
    autoConnect: true,
    publicClient: publicClient,
    connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: projectId,
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
});
const ethereumClient = new EthereumClient(config, chains);

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Secured Finance</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>

            <Provider store={store}>
                <Providers>
                    <Layout navBar={<Header />} footer={<Footer />}>
                        <Component {...pageProps} />
                    </Layout>
                </Providers>
            </Provider>
        </>
    );
}

const Providers: React.FC = ({ children }) => {
    const network = getEthereumNetwork();

    return (
        <GraphClientProvider network={network}>
            <WagmiConfig config={config}>
                <SecuredFinanceProvider>{children}</SecuredFinanceProvider>
                <Web3Modal
                    projectId={projectId}
                    ethereumClient={ethereumClient}
                />
            </WagmiConfig>
        </GraphClientProvider>
    );
};

export default App;
