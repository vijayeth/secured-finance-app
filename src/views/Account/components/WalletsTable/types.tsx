import { formatAddress } from "../../../../utils";
import CurrencyContainer from "../../../../components/CurrencyContainer";
import React from "react";
import { RenderBalance, RenderPrice, RenderActions, RenderPortfolio } from "./components";

interface WalletTableDataProps {
    columns?: Array<TableColumns>,
    data?: Array<WalletTableData>,
}

export interface WalletTableData {
    asset: string,
    address: string,
    balance: number,
    growth: number,
    price: number,
    portfolio: number,
    actions: any,
    isAvailable: boolean,
}

export interface TableColumns {
    Header: string,
    id: string,
    isHiddenHeader: boolean,
    columns: Array<Columns>,
    isSorted?: boolean,
    isSortedDesc?: boolean,
}

interface Columns {
    Header: string,
    accessor: string,
    Cell: any,
}

export const walletTableColumns = [{
    Header: '',
    id: 'wallets',
    isHiddenHeader: false,
    columns: [
        {
            Header: 'Asset',
            accessor: 'ccyIndex',
            Cell: ( cell: { value: number } ) => <CurrencyContainer index={cell.value} short={false} wallet={true}/>
        },
        {
            Header: 'Address',
            accessor: 'address',
            Cell: ( cell: { value: string } ) => <span>{formatAddress(cell.value, 24)}</span>
        },
        {
            Header: 'Balance',
            accessor: 'balance',
            Cell: ( cell : { value: any, row: any } ) => <RenderBalance balance={cell.value} index={cell.row.values.ccyIndex} value={cell.row.original.usdBalance}/>
        },
        {
            Header: 'Price',
            accessor: 'assetPrice',
            Cell: ( cell : { value: any, row: any } ) => <RenderPrice price={cell.value} dailyChange={cell.row.original.dailyChange}/>
        },
        {
            Header: 'Portfolio',
            accessor: 'portfolioShare',
            Cell: ( cell : { value: any } ) => <RenderPortfolio share={cell.value}/>
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: (cell: {value: any, row: any }) => <RenderActions callbackMap={cell.value} ccyIndex={cell.row.values.ccyIndex}/>
        },
    ]
}] as Array<TableColumns>