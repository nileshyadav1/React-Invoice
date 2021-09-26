import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer , FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,} from "redux-persist";
import ToggleModalSlice from "./ToggleModalSlice";
import ToggleConfirmSlice from "./ToggleConfirmSlice";
import GetInvoiceSlice from "./GetInvoiceSlice";

// export default configureStore({
//     reducer:{
//         toggle :ToggleModalSlice,
//         toggleConfirm : ToggleConfirmSlice,
//         getinvoice :GetInvoiceSlice
//     }
// })

const reducers = combineReducers({
  toggle: ToggleModalSlice,
  toggleConfirm: ToggleConfirmSlice,
  getinvoice: GetInvoiceSlice,
});

const persistConfig = {
    key: 'root',
    version:1,
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
   
});


export default store;