import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SuggestionsState {
  value: string[] | null;
}

const initialState: SuggestionsState = {
  value: null,
};

export const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    updateSuggestions: (state, action: PayloadAction<string[] | null>) => {
      state.value = action.payload;
    },
  },
});

export const { updateSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
