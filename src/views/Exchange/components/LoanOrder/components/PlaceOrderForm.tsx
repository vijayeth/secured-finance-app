import { Input } from 'src/components/common/Inputs';
import { Dropdown } from 'src/components/common/Dropdown';
import { termsList } from 'src/components/atoms';
import { InfoTable } from './InfoTable';
import React from 'react';

interface IPlaceOrderForm {
    amountFILValue: string;
    onChangeAmountFILValue: (e: React.FormEvent<HTMLInputElement>) => void;
    termValue: string;
    onChangeTerm: (e: React.FormEvent<HTMLSelectElement>) => void;
    insertRateValue: string;
    onChangeInsertRate: (e: React.FormEvent<HTMLInputElement>) => void;
}

export const PlaceOrderForm: React.FC<IPlaceOrderForm> = ({
    amountFILValue,
    onChangeAmountFILValue,
    termValue,
    onChangeTerm,
    insertRateValue,
    onChangeInsertRate,
}) => {
    return (
        <>
            <Input
                label={['Amount FIL', 'Balance: 0.00']}
                type={'number'}
                placeholder={'0'}
                value={amountFILValue}
                onChange={onChangeAmountFILValue}
            />
            <Dropdown
                label={'Term'}
                onChangeValue={onChangeTerm}
                value={termValue}
                options={termsList}
            />
            <Input
                label={['Interest rate', 'Market Rate: 7.10 %']}
                type={'number'}
                placeholder={'0'}
                value={insertRateValue}
                onChange={onChangeInsertRate}
            />

            <InfoTable />
        </>
    );
};
