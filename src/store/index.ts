import { configureStore } from '@reduxjs/toolkit';
import assetPrices from './assetPrices';
import availableContracts from './availableContracts';
import blockchain from './blockchain';
import { listenerMiddleware } from './blockchain/reducer';
import landingOrderForm from './landingOrderForm';
import lastError from './lastError';
import wallet from './wallet';

export const rootReducers = {
    assetPrices,
    availableContracts,
    blockchain,
    landingOrderForm,
    lastError,
    wallet,
};

const store = configureStore({
    reducer: rootReducers,
    // This setting reproduce the behavior without redux-toolkit.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).prepend(listenerMiddleware.middleware),
});
export default store;
export type AppDispatch = typeof store.dispatch;
