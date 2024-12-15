import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SelectedState {
  value: boolean;
}

const initialState: SelectedState = {
  value: false,
};

export const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    updateSelected: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { updateSelected } = selectedSlice.actions;
export default selectedSlice.reducer;
