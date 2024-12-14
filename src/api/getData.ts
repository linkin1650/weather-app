export async function getCurrentWeather(query: string) {
  fetch(`http://api.weatherapi.com/v1/current.json?key=57cf083f7dc842cfb8a155518241212&q=${query}&aqi=yes
`)
    .then((res) => res.json())
    .then((data) => console.log(data));
}

