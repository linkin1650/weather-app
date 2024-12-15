import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface HistoryListState {
  value: string[] | null;
}

const initialState: HistoryListState = {
  value: null,
};

export const historyListSlice = createSlice({
  name: "historyList",
  initialState,
  reducers: {
    updateHistoryList: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { updateHistoryList } = historyListSlice.actions;
export default historyListSlice.reducer;
