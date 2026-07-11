const weatherCodes = {
    0: "☀️ Derült",
    1: "🌤 Többnyire derült",
    2: "⛅ Enyhén felhős",
    3: "☁️ Borult",
    45: "🌫 Köd",
    48: "🌫 Zúzmarás köd",
    51: "🌦 Enyhe szitálás",
    53: "🌦 Szitálás",
    55: "🌧 Erős szitálás",
    61: "🌦 Gyenge eső",
    63: "🌧 Eső",
    65: "🌧 Erős eső",
    71: "🌨 Gyenge hó",
    73: "❄️ Havazás",
    75: "❄️ Erős havazás",
    80: "🌦 Zápor",
    81: "🌧 Erős zápor",
    82: "⛈ Heves zápor",
    95: "⛈ Zivatar"
};

async function getWeather(){

    const city = document.getElementById("city").value.trim();

    if(city===""){
        alert("Adj meg egy várost!");
        return;
    }

    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=hu&format=json`);
    const geoData = await geo.json();

    if(!geoData.results){
        document.getElementById("weather").innerHTML="Nincs találat.";
        return;
    }

    const place = geoData.results[0];

    loadWeather(place.latitude, place.longitude, place.name);
}

async function loadWeather(lat,lon,name){

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    );

    const data = await response.json();

    document.getElementById("weather").innerHTML=`
        <h2>${name}</h2>
        <h1>${data.current.temperature_2m} °C</h1>
        <p>${weatherCodes[data.current.weather_code] || "Ismeretlen"}</p>
        <p>💧 Páratartalom: ${data.current.relative_humidity_2m}%</p>
        <p>💨 Szél: ${data.current.wind_speed_10m} km/h</p>
    `;
}

function getLocation(){

    navigator.geolocation.getCurrentPosition(async(position)=>{

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`);
        const geoData = await geo.json();

        let city="Jelenlegi hely";

        if(geoData.results){
            city=geoData.results[0].name;
        }

        loadWeather(lat,lon,city);

    },()=>{

        alert("Nem sikerült lekérni a helyzeted.");

    });

}
