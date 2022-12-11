import { configureStore } from '@reduxjs/toolkit';
import advancedLendingForm from './advancedLendingForm';
import assetPrices from './assetPrices';
import availableContracts from './availableContracts';
import blockchain from './blockchain';
import { listenerMiddleware } from './blockchain/reducer';
import ethereumWallet from './ethereumWallet';
import landingOrderForm from './landingOrderForm';
import lastError from './lastError';

export const rootReducers = {
    ethereumWallet,
    assetPrices,
    blockchain,
    lastError,
    landingOrderForm,
    availableContracts,
    advancedLendingForm,
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
