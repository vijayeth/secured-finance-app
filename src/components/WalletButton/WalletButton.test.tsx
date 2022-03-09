import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { render, screen } from 'src/test-utils.js';
import { WalletButton } from './WalletButton';

describe('Wallet Button component', () => {
    beforeEach(() => {
        localStorage.removeItem('CACHED_PROVIDER_KEY');
    });

    it('Should render the Unlock Wallet button when not connected', () => {
        render(<WalletButton />);
        expect(screen.getByText('Unlock Wallet')).toBeInTheDocument();
    });
    it('Should render the a link to My Wallet when connected', () => {
        localStorage.setItem('CACHED_PROVIDER_KEY', 'connected');
        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <WalletButton />
            </Router>
        );
        expect(screen.getByText('My Wallet')).toBeInTheDocument();
    });
});
