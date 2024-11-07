//going to use OpenWeatherMap's Air Quality API
const apiKey = '23b1363ce46188a601ed51900d4a058c';
const apiurl = 'https://api.openweathermap.org/data/2.5/air_pollution';

//url = apiurl?lat={lat}&lon={lon}&appid={apikey}

async function getairqualityindex(lat,lon) {
    try {
        const response = await fetch(`${apiurl}?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        console.log(data);
        document.getElementById('pm2.5').innerHTML = `${data.list[0].components.pm2_5}` ;
        document.getElementById('pm10').innerHTML = `${data.list[0].components.pm10}` ;
        document.getElementById('o3').innerHTML = `${data.list[0].components.o3}` ;
        document.getElementById('no2').innerHTML = `${data.list[0].components.no2}` ;
        document.getElementById('so2').innerHTML = `${data.list[0].components.so2}` ;

        
    }

    catch(error){
        console.log("error")
    }

}

//Example coordinates for San Francisco
const lan = 37.7749;
const lon = -122.4194;

//Adding AQI(Air Qulaity Index) to HTML
 

getairqualityindex(lan,lon);
