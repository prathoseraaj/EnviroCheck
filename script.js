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

//going to use OpenWeatherMap's to fetch weekly Air Quality API

const weeklyUrl = 'http://api.openweathermap.org/data/2.5/air_pollution/history';

async function getweekairqualityindex(lat,lon) {
    const weeksInMonth = 4 ;
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate( currentDate.getDate() - 30 );
    //console.log(oneMonthAgo); TO CHECK
    //console.log(currentDate); TO CHECK

    let date = oneMonthAgo ;

    for (let i = 0; i < weeksInMonth; i++) {
        //we need to convert the date to timestrap ie; Convert 2024-10-31 into a UNIX timestamp. The timestamp will look something like 1635654000.
        const timestamp = Math.floor(date.getTime() / 1000);
        /*console.log(timestamp); TO CHECK TIMESTAMP VALUE*/
        const weeklydataurl = `${weeklyUrl}?lat=${lat}&lon=${lon}&start=${timestamp}&end=${timestamp + (7 * 86400)}&appid=${apiKey}`;

        //fetchdata
        try{
        const weeklyresponse = await fetch(weeklydataurl);
        const weeklydata = await weeklyresponse.json();
        console.log(weeklydata);
        }
        catch(error){
            console.error('Error fetching data:', error);

        }
}
}


//Example coordinates for San Francisco
const lat = 37.7749;
const lon = -122.4194;

//Adding AQI(Air Qulaity Index) to HTML
 

getairqualityindex(lat,lon);
getweekairqualityindex(lat,lon);
