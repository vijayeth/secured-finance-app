import { NavLink, useRouteMatch } from 'react-router-dom';
import SFLogo from 'src/assets/img/logo.svg';
import { NavTab, TraderProTab } from 'src/components/atoms';
import { WalletButton } from '../WalletProviderModal';

export const Header = () => {
    return (
        <nav
            data-cy='header'
            className={`} flex h-20 w-full flex-row items-center justify-between border-b
            border-neutral1`}
        >
            <NavLink
                className='ml-5 flex h-10 items-center justify-center'
                to='/'
            >
                <SFLogo className='h-10 w-[200px]' />
            </NavLink>
            <div className='flex items-center justify-center'>
                <ItemLink text='OTC Lending' dataCy='lending' link='/' />
                <ItemLink
                    text='Market Dashboard'
                    dataCy='terminal'
                    link='/exchange'
                />
                <ItemLink
                    text='Portfolio Management'
                    dataCy='history'
                    link='/history'
                />
                <TraderProTab text='Trader Pro'></TraderProTab>
            </div>
            <div className='mr-5' data-cy='wallet'>
                <WalletButton />
            </div>
        </nav>
    );
};

const ItemLink = ({
    text,
    dataCy,
    link,
}: {
    text: string;
    dataCy: string;
    link: string;
}) => {
    const useCheckActive = (): boolean => {
        return useRouteMatch({ path: link, exact: true }) ? true : false;
    };
    return (
        <NavLink exact data-cy={dataCy.toLowerCase()} to={link}>
            <NavTab text={text} active={useCheckActive()} />
        </NavLink>
    );
};
