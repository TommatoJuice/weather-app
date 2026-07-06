async function getWeather(){

const city=document.getElementById("city").value;

if(city==="") return;

const geo=await fetch(
`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
);

const geoData=await geo.json();

if(!geoData.results){

document.getElementById("weather").innerHTML="Nincs ilyen város.";

return;

}

const lat=geoData.results[0].latitude;
const lon=geoData.results[0].longitude;

const weather=await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
);

const weatherData=await weather.json();

document.getElementById("weather").innerHTML=`
<h2>${geoData.results[0].name}</h2>
<p>🌡 ${weatherData.current.temperature_2m} °C</p>
`;

}
