import React from 'react';
import { connect } from 'react-redux';
import { useRates } from 'src/hooks/useRates';
import useSF from 'src/hooks/useSecuredFinance';
import { getLendingControllerContract } from 'src/services/sdk/utils';
import { LendingStore } from 'src/store/lending';
import { RootState } from 'src/store/types';
import YieldGraph from './components/Graph';
import cm from './index.module.scss';
import { ChartInfo } from './components/ChartInfo';
import { Page } from 'src/components/new/Page';
import { PlaceOrder } from './components/PlaceOrder';
// import PlaceOrderObsolete from './components/PlaceOrderObsolete';

const Lending: React.FC<LendingStore> = ({ selectedCcy }) => {
    const securedFinance = useSF();
    const lendingController = getLendingControllerContract(securedFinance);
    const borrowRates = useRates(lendingController, 0, selectedCcy);
    const lendingRates = useRates(lendingController, 1, selectedCcy);
    const midRate = useRates(lendingController, 2, selectedCcy);

    return (
        <Page>
            <div className={cm.container}>
                <div className={cm.chartAndInfo}>
                    <ChartInfo />
                    <YieldGraph
                        borrowRates={borrowRates}
                        lendingRates={lendingRates}
                        midRate={midRate}
                    />
                </div>
                <PlaceOrder
                    borrowRates={lendingRates}
                    lendingRates={borrowRates}
                />

                {/*<PlaceOrderObsolete*/}
                {/*    borrowRates={borrowRates}*/}
                {/*    lendingRates={lendingRates}*/}
                {/*/>*/}
            </div>
        </Page>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(Lending);
