import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  showTutorial: boolean;
  showInternal: boolean;
  difficulty: number;
}

const initialState: SettingsState = {
  showTutorial: false,
  showInternal: false,
  difficulty: 9, 
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
    setDifficulty(state, action: PayloadAction<number>) {
      state.difficulty = action.payload;
    },
  },
});

export const { setShowTutorial, setShowInternal, setDifficulty } = settingsSlice.actions;
export default settingsSlice.reducer;