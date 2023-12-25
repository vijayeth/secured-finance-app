import { getSupportedChainIds } from 'src/utils';
import { mainnet, sepolia } from 'wagmi';

export const SupportedNetworks = () => {
    const chainIds = getSupportedChainIds();
    const networkNames = [sepolia, mainnet]
        .filter(chain => chainIds.includes(chain.id))
        .map(chain => chain.name)
        .map(name => (name === 'Ethereum' ? 'Mainnet' : name));

    return (
        <>
            Secured Finance only supported on{' '}
            <span className='capitalize'>
                {networkNames.length === 2
                    ? networkNames.join(' and ')
                    : networkNames.join(', ')}
            </span>{' '}
            in Ethereum
        </>
    );
};
