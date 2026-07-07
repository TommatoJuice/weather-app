const weatherCodes = {
    0: "☀️ Derült",
    1: "🌤 Többnyire derült",
    2: "⛅ Enyhén felhős",
    3: "☁️ Borult",
    45: "🌫 Köd",
    48: "🌫 Zúzmarás köd",
    51: "🌦 Szitálás",
    61: "🌧 Eső",
    71: "❄️ Hó",
    80: "🌦 Zápor",
    95: "⛈ Zivatar"
};

async function getWeather(city) {

    if (!city) return;

    const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    const geoData = await geo.json();

    if (!geoData.results) {

        document.getElementById("weather").innerHTML =
            "<h2>Nincs ilyen város.</h2>";

        return;
    }

    const place = geoData.results[0];

    const response = await fetch(

`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`

    );

    const data = await response.json();

    let html = `

<h2>${place.name}</h2>

<p>${place.country}</p>

<h1>${data.current.temperature_2m}°C</h1>

<p>${weatherCodes[data.current.weather_code] || "Ismeretlen"}</p>

<p>🤒 Hőérzet: ${data.current.apparent_temperature}°C</p>

<p>💧 Páratartalom: ${data.current.relative_humidity_2m}%</p>

<p>💨 Szél: ${data.current.wind_speed_10m} km/h</p>

<p>🌅 Napkelte: ${data.daily.sunrise[0].substring(11,16)}</p>

<p>🌇 Napnyugta: ${data.daily.sunset[0].substring(11,16)}</p>

<hr>

<h3>7 napos előrejelzés</h3>

`;

    for(let i=0;i<7;i++){

        html += `

<p>

📅 ${data.daily.time[i]}

<br>

⬆️ ${data.daily.temperature_2m_max[i]}°C

⬇️ ${data.daily.temperature_2m_min[i]}°C

</p>

`;

    }

    document.getElementById("weather").innerHTML = html;

}

document
.getElementById("searchBtn")
.addEventListener("click", () => {

    getWeather(document.getElementById("city").value);

});

document
.getElementById("city")
.addEventListener("keydown", e => {

    if(e.key==="Enter"){

        getWeather(document.getElementById("city").value);

    }

});
