import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import interactionReducer from './interactionSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    interaction: interactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;