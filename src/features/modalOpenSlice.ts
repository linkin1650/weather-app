import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ModalOpenState {
  value: boolean;
}

const initialState: ModalOpenState = {
  value: false,
};

export const modalOpenSlice = createSlice({
  name: "modalOpen",
  initialState,
  reducers: {
    updateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { updateModalOpen } = modalOpenSlice.actions;
export default modalOpenSlice.reducer;
