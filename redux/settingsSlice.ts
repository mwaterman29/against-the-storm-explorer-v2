import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  showTutorial: boolean;
  showInternal: boolean;
}

const initialState: SettingsState = {
  showTutorial: false,
  showInternal: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setShowTutorial(state, action: PayloadAction<boolean>) {
      state.showTutorial = action.payload;
    },
    setShowInternal(state, action: PayloadAction<boolean>) {
      state.showInternal = action.payload;
    },
  },
});

export const { setShowTutorial, setShowInternal } = settingsSlice.actions;
export default settingsSlice.reducer;