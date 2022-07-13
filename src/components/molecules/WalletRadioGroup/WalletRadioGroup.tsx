import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/outline';
import CircleOutline from 'src/assets/icons/circle-outline.svg';
import MetaMaskIcon from 'src/assets/img/metamask-fox.svg';
import WalletConnectIcon from 'src/assets/img/wallet-connect.svg';
import { formatDataCy } from 'src/utils';

const WalletOption = ({
    name,
    Icon,
}: {
    name: string;
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}) => {
    return (
        <RadioGroup.Option
            value={name}
            data-cy={formatDataCy(name.concat('-radio-option'))}
            className='relative·flex·cursor-pointer·rounded-lg·px-5·py-4·focus:outline-none'
        >
            {({ checked }) => (
                <>
                    <div className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                            <div className='text-sm'>
                                <RadioGroup.Label
                                    className={`font-medium  ${
                                        checked ? 'text-white' : 'text-black-30'
                                    }`}
                                >
                                    <span className='flex'>
                                        <Icon className='h-6 w-6' />
                                        <p className='ml-6 text-white'>
                                            {name}
                                        </p>
                                    </span>
                                </RadioGroup.Label>
                            </div>
                        </div>
                        {checked ? (
                            <div className='rounded-full border-2 border-teal border-opacity-40 bg-starBlue text-white'>
                                <CheckIcon className='h-6 w-6' />
                            </div>
                        ) : (
                            <div className='rounded-full border-2 border-teal border-opacity-40 text-white'>
                                <CircleOutline className='h-6 w-6' />
                            </div>
                        )}
                    </div>
                </>
            )}
        </RadioGroup.Option>
    );
};
export const WalletRadioGroup = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) => {
    return (
        <RadioGroup
            value={value}
            onChange={onChange}
            className='rounded-lg border border-moonGrey border-opacity-40 py-4'
            data-cy='radio-group'
        >
            <WalletOption name='Metamask' Icon={MetaMaskIcon} />
            <WalletOption name='WalletConnect' Icon={WalletConnectIcon} />
        </RadioGroup>
    );
};
