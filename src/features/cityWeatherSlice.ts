import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { WeatherApiResponse } from "../types/type";

export interface CityWeatherState {
  value: WeatherApiResponse | null;
}

const initialState: CityWeatherState = {
  value: null,
};

export const cityWeatherSlice = createSlice({
  name: "cityWeather",
  initialState,
  reducers: {
    updateCityWeather: (
      state,
      action: PayloadAction<WeatherApiResponse | null>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { updateCityWeather } = cityWeatherSlice.actions;
export default cityWeatherSlice.reducer;
