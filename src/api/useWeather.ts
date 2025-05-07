const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export const useWeather = () => {
    const weatherFetcher = async (_: string,{ arg }: { arg: string }) => {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${arg}&days=6&aqi=no&alerts=no`);
      if (!res.ok) throw new Error("api error");
      return res.json();
    }

    return {
        weatherFetcher,
    }
}

