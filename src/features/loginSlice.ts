import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  value: boolean;
}

const initialState: LoginState = {
  value: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    updateLogin: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { updateLogin } = loginSlice.actions;
export default loginSlice.reducer;
