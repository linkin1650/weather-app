import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface RegisterFormState {
  value: boolean;
}

const initialState: RegisterFormState = {
  value: false,
};

export const registerFormSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
    updateRegisterForm: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { updateRegisterForm } = registerFormSlice.actions;
export default registerFormSlice.reducer;
