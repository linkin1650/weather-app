import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ProgressState {
  value: number;
}

const initialState: ProgressState = {
  value: 13,
};

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    updateProgress: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { updateProgress } = progressSlice.actions;
export default progressSlice.reducer;
