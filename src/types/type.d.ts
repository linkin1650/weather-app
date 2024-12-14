export type WeatherApiResponse = {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    condition: {
      text: string;
      icon: string;
    };
    temp_c: number;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
};

export type ForecastDay = {
  date: string;
  day: {
    condition: {
      text: string;
      icon: string;
    };
    maxtemp_c: number;
    mintemp_c: number;
  };
};

export type SearchBarProps = {
  handleSearchClick: () => Promise<void>;
};
