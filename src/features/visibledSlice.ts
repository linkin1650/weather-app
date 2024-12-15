import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface VisibledState {
  value: number;
}

const initialState: VisibledState = {
  value: 0,
};

export const visibledSlice = createSlice({
  name: "visibled",
  initialState,
  reducers: {
    updateVisibled: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { updateVisibled } = visibledSlice.actions;
export default visibledSlice.reducer;
