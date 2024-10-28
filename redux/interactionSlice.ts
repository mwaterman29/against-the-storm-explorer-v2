import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InteractionState {
  inputText: string;
  isOverlayOpen: boolean;
}

const initialState: InteractionState = {
  inputText: '',
  isOverlayOpen: false,
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    setInputText(state, action: PayloadAction<string>) {
      state.inputText = action.payload;
    },
    setIsOverlayOpen(state, action: PayloadAction<boolean>) {
      state.isOverlayOpen = action.payload;
    },
  },
});

export const { setInputText, setIsOverlayOpen } = interactionSlice.actions;
export default interactionSlice.reducer;