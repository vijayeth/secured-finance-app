import { ExternalLinkIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { formatDataCy } from 'src/utils';

export const MenuItem = ({
    text,
    icon,
    link,
}: {
    text: string;
    icon: React.ReactNode;
    link: string;
}) => {
    return (
        <div
            data-cy={formatDataCy(text)}
            className='group relative flex w-full cursor-pointer items-center rounded-md p-2 transition hover:bg-horizonBlue focus:outline-none'
        >
            <Link
                href={link}
                className='align-center flex h-full w-full '
                passHref
            >
                <a
                    href={link}
                    className='h-full w-full'
                    aria-label='Menu Item'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <div className=' group relative flex w-full cursor-pointer items-center'>
                        <div className='flex h-10 w-10 items-center justify-center'>
                            {icon}
                        </div>
                        <div className='flex w-full justify-between'>
                            <p className='typography-caption flex w-[90%] capitalize text-white'>
                                {text}
                            </p>

                            <span className='absolute right-0 my-1 h-full transform align-top transition-opacity group-hover:opacity-100'>
                                <ExternalIcon />
                            </span>
                        </div>
                    </div>
                </a>
            </Link>
        </div>
    );
};

const ExternalIcon = () => (
    <ExternalLinkIcon className='h-4 w-4 text-slateGray' />
);
