import { configureStore } from "@reduxjs/toolkit";
import queryReducer from "./features/querySlice.ts";
import cityWeatherReducer from "./features/cityWeatherSlice.ts";
import suggestionsReducer from "./features/suggestionsSlice.ts";

export const store = configureStore({
  reducer: {
    query: queryReducer,
    cityWeather: cityWeatherReducer,
    suggestions: suggestionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
