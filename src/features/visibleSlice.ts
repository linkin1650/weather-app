import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface VisibleState {
  value: number;
}

const initialState: VisibleState = {
  value: 0,
};

export const visibleSlice = createSlice({
  name: "visible",
  initialState,
  reducers: {
    updateVisible: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { updateVisible } = visibleSlice.actions;
export default visibleSlice.reducer;
