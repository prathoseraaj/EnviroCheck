//going to use Ambee's Air Quality API
const apiKey = '23b1363ce46188a601ed51900d4a058c';
const apiurl = 'https://api.openweathermap.org/data/2.5/air_pollution';

//url = apiurl?lat={lat}&lon={lon}&appid={apikey}

async function getairqualityindex(lat,lon) {
    try {
        const response = await fetch(`${apiurl}?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        console.log(data);
    }

    catch(error){
        console.log("error")
    }

}

//Example coordinates for San Ftancisco
const lan = 37.7749;
const lon = -122.4194;


getairqualityindex(lan,lon);