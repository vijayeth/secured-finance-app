export enum QueryKeys {
    BORROWABLE_AMOUNT = 'BORROWABLE_AMOUNT',
    CURRENCIES = 'CURRENCIES',
    COLLATERAL_BOOK = 'COLLATERAL_BOOK',
    COLLATERAL_CURRENCIES = 'COLLATERAL_CURRENCIES',
    CURRENCY_EXISTS = 'CURRENCY_EXISTS',
    LENDING_MARKETS = 'LENDING_MARKETS',
    ORDER_BOOK = 'ORDER_BOOK',
    ORDER_ESTIMATE = 'ORDER_ESTIMATE',
    ORDER_FEE = 'ORDER_FEE',
    ORDER_LIST = 'ORDER_LIST',
    POSITIONS = 'POSITIONS',
    PROTOCOL_DEPOSIT_AMOUNT = 'PROTOCOL_DEPOSIT_AMOUNT',
    TOKEN_BALANCE = 'TOKEN_BALANCE',
    USED_CURRENCIES_FOR_ORDERS = 'USED_CURRENCIES_FOR_ORDERS',
    TERMINATED = 'IS_TERMINATED',
    TERMINATION_DATE = 'TERMINATION_DATE',
    TERMINATION_RATIO = 'TERMINATION_RATIO',
    TERMINATION_REDEMPTION_REQUIRED = 'TERMINATION_REDEMPTION_REQUIRED',
    TERMINATION_PRICES = 'TERMINATION_PRICES',
    LAST_PRICES = 'LAST_PRICES',
    PRICE_DECIMALS = 'PRICE_DECIMALS',
}

export const QUERIES_TO_INVALIDATE = [
    QueryKeys.COLLATERAL_BOOK,
    QueryKeys.ORDER_BOOK,
    QueryKeys.LENDING_MARKETS,
    QueryKeys.USED_CURRENCIES_FOR_ORDERS,
    QueryKeys.ORDER_LIST,
    QueryKeys.POSITIONS,
    QueryKeys.PROTOCOL_DEPOSIT_AMOUNT,
    QueryKeys.TOKEN_BALANCE,
    QueryKeys.LAST_PRICES,
    QueryKeys.BORROWABLE_AMOUNT,
];
