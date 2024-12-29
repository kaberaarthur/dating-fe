import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage for web (localStorage)
import userReducer from "./Reducers/userSlice";
import stepReducer from "./Reducers/stepSlice";

// Persist configuration
const persistConfig = {
  key: "root", // Key to identify persisted data in storage
  storage,     // Use localStorage to persist the state
};

// Wrap the user reducer and step reducer with persistReducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedStepReducer = persistReducer(persistConfig, stepReducer);  // Add persistence for stepReducer

// Configure the store with the persisted reducers
const Store = configureStore({
  reducer: {
    user: persistedUserReducer,  // Persisted reducer for the 'user' slice
    step: persistedStepReducer,  // Persisted reducer for the 'step' slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // Ignore non-serializable actions from redux-persist
      },
    }),
});

// Persistor for rehydrating the store
export const persistor = persistStore(Store);

// Export store and types for use with Redux
export default Store;
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
