import BigNumber from 'bignumber.js';
import React, { useCallback, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Button } from 'src/components/atoms';
import styled from 'styled-components';
import { usePlaceOrder } from '../../../../../hooks/usePlaceOrder/usePlaceOrder';
import {
    LendingTerminalStore,
    updateBorrowAmount,
    updateBorrowRate,
    updateLendingTerms,
} from '../../../../../store/lendingTerminal';
import { RootState } from '../../../../../store/types';
import { PlaceOrderForm } from './PlaceOrderForm';

const Borrow: React.FC<LendingTerminalStore> = ({
    selectedCcy,
    borrowAmount,
    borrowRate,
    selectedTerms,
}) => {
    const dispatch = useDispatch();
    const [termsOpen, setTermsOpen] = useState(false);
    const [pendingTx, setPendingTx] = useState(false);

    const handleOpenTerms = useCallback(
        (e: React.FormEvent<HTMLSelectElement>, termsOpen: boolean) => {
            dispatch(updateLendingTerms(e.currentTarget.value));
            setTermsOpen(!termsOpen);
        },
        [dispatch]
    );

    const handleInterestRate = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateBorrowRate(e.currentTarget.valueAsNumber));
        },
        [dispatch]
    );

    const handleBorrowAmount = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateBorrowAmount(e.currentTarget.valueAsNumber));
        },
        [dispatch]
    );

    const { placeOrder } = usePlaceOrder();
    const handleBorrowDeal = useCallback(async () => {
        try {
            setPendingTx(true);
            await placeOrder(
                selectedCcy,
                selectedTerms,
                1,
                borrowAmount,
                new BigNumber(borrowRate).multipliedBy(100).toNumber()
            );
            setPendingTx(false);
        } catch (e) {
            console.error(e);
        }
    }, [borrowAmount, borrowRate, placeOrder, selectedCcy, selectedTerms]);

    return (
        <StyledLoanContainer>
            <PlaceOrderForm
                amountFILValue={borrowAmount.toString()}
                onChangeAmountFILValue={handleBorrowAmount}
                termValue={selectedTerms}
                onChangeTerm={(e: React.FormEvent<HTMLSelectElement>) =>
                    handleOpenTerms(e, termsOpen)
                }
                insertRateValue={borrowRate.toString()}
                onChangeInsertRate={handleInterestRate}
            />

            <StyledButtonContainer>
                <Button onClick={handleBorrowDeal} disabled={pendingTx}>
                    Borrow
                </Button>
            </StyledButtonContainer>
        </StyledLoanContainer>
    );
};

const StyledLoanContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledButtonContainer = styled.div`
    display: grid;
    margin-top: 13px;
`;

const mapStateToProps = (state: RootState) => state.lendingTerminal;
export default connect(mapStateToProps)(Borrow);
