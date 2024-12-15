import { configureStore } from "@reduxjs/toolkit";
import queryReducer from "./features/querySlice.ts";
import cityWeatherReducer from "./features/cityWeatherSlice.ts";
import suggestionsReducer from "./features/suggestionsSlice.ts";
import selectedReducer from "./features/selectedSlice.ts";
import loadingReducer from "./features/loadingSlice.ts";
import progressReducer from "./features/progressSlice.ts"
import visibledRuducer from "./features/visibledSlice.ts"

export const store = configureStore({
  reducer: {
    query: queryReducer,
    cityWeather: cityWeatherReducer,
    suggestions: suggestionsReducer,
    selected: selectedReducer,
    loading: loadingReducer,
    progress: progressReducer,
    visibled: visibledRuducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
