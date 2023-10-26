import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextLink } from 'src/components/atoms';
import { CurrencyDropdown } from 'src/components/molecules';
import { GlobalItayoseMultiCurveChart } from 'src/components/organisms';
import { baseContracts, useLendingMarkets } from 'src/hooks';
import {
    selectLandingOrderForm,
    setCurrency,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { countdown, getCurrencyMapAsOptions } from 'src/utils';

export const GlobalItayose = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const { currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingContracts = baseContracts } = useLendingMarkets();
    const targetTime = useMemo(() => {
        let time = 0;
        for (const maturity of Object.keys(lendingContracts[currency])) {
            const contract = lendingContracts[currency][Number(maturity)];
            if (
                (contract.isItayosePeriod || contract.isPreOrderPeriod) &&
                (time === 0 || contract.utcOpeningDate * 1000 < time)
            )
                time = contract.utcOpeningDate * 1000;
        }

        return time;
    }, [lendingContracts, currency]);

    const [time, setTime] = useState<string>(countdown(targetTime));
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(countdown(targetTime));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [targetTime]);

    return (
        <div className='grid grid-flow-row justify-items-center gap-y-8 text-center'>
            <section className='grid grid-flow-row justify-items-center gap-y-8 px-8 pt-12'>
                <h1 className='typography-headline-1 text-white'>
                    Pre-Open Market: Global Itayose
                </h1>
                <h2 className='typography-body-2 w-full text-white-80 laptop:w-[525px]'>
                    We&apos;re excited to debut with four major currencies for
                    the first four quarterly contracts. Stay tuned for the
                    introduction of additional markets.
                </h2>
            </section>

            <section className='grid grid-flow-row justify-items-center gap-y-6 text-nebulaTeal'>
                <p data-chromatic='ignore'>Ends in {time}</p>
                <div className='flex flex-row items-center gap-4'>
                    <CurrencyDropdown
                        currencyOptionList={assetList}
                        selected={assetList[0]}
                        onChange={value => dispatch(setCurrency(value))}
                    />
                    <Button
                        size='md'
                        onClick={() => {
                            router.push('/itayose/');
                        }}
                    >
                        GO
                    </Button>
                </div>
            </section>

            <section className='w-full max-w-[90%] laptop:w-[746px]'>
                <GlobalItayoseMultiCurveChart />
            </section>

            <section className='px-8 text-center text-white-80'>
                <p>
                    Learn more about Itayose on&nbsp;
                    <TextLink
                        href='http://docs.secured.finance/'
                        text='Secured Finance Docs'
                    />
                </p>
            </section>
        </div>
    );
};
