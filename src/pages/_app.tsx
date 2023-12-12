import { init } from '@amplitude/analytics-browser';
import { LogLevel } from '@amplitude/analytics-types';
import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Provider, useSelector } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import store from 'src/store';
import { selectNetworkName } from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import {
    getAmplitudeApiKey,
    getSupportedChains,
    getWalletConnectId,
} from 'src/utils';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '../assets/css/index.css';

const projectId = getWalletConnectId();

const queryClient = new QueryClient();

init(getAmplitudeApiKey(), undefined, {
    appVersion: process.env.SF_ENV,
    logLevel: LogLevel.None,
});

const { chains, publicClient } = configureChains(getSupportedChains(), [
    alchemyProvider({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
    }),
    publicProvider(),
]);

const config = createConfig({
    autoConnect: false,
    publicClient: publicClient,
    connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: projectId,
                qrModalOptions: {
                    themeVariables: {
                        '--wcm-font-family':
                            "'Suisse International', sans-serif",
                        '--wcm-accent-color': '#002133',
                        '--wcm-background-color': '#5162FF',
                    },
                },
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

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
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
                    <Layout
                        navBar={
                            <Header
                                showNavigation={
                                    router.pathname !== '/emergency'
                                }
                            />
                        }
                        footer={<Footer />}
                    >
                        <Component {...pageProps} />
                    </Layout>
                </Providers>
            </Provider>
        </>
    );
}

const Providers: React.FC = ({ children }) => {
    const currentNetwork = useSelector((state: RootState) =>
        selectNetworkName(state)
    );

    return (
        <QueryClientProvider client={queryClient}>
            <GraphClientProvider network={currentNetwork}>
                <WagmiConfig config={config}>
                    <SecuredFinanceProvider>{children}</SecuredFinanceProvider>
                </WagmiConfig>
            </GraphClientProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
