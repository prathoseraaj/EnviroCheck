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
        console.error("error")
    }

}

//going to use OpenWeatherMap's to fetch weekly Air Quality API

const weeklyUrl = 'https://api.openweathermap.org/data/2.5/air_pollution/history';

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
        processweeklydata(weeklydata);
        }
        catch(error){
            console.error('Error fetching data:', error);

        }
        //move to the next week
        date.setDate(date.getDate() + 7);
    }
}

function processweeklydata(weeklydata) {
    if(weeklydata && weeklydata.list) {
        const pollutionData = weeklydata.list.map((item) => ({
            time: new Date(item.dt * 1000).toLocaleString(),
            pm2_5: item.components.pm2_5 ,
            pm10: item.components.pm10 ,
            o3: item.components.o3 ,
            no2: item.components.no2 ,
            so2: item.components.so2 ,
        })); 
    console.table(pollutionData); 

    //filtering the data 
    const filterdata = pollutionData.filter((item => {
        const hours = new Date(item.time).getHours();
        return hours === 12 ;
    }))    

    //for plotting
        time = filterdata.map(item => item.time.toLocaleString());
        pm2_5 = filterdata.map(item => item.pm2_5);
        pm10 = filterdata.map(item => item.pm10);
        o3 = filterdata.map(item => item.o3);
        no2 = filterdata.map(item => item.no2);
        so2 = filterdata.map(item => item.so2);
        generateGraph(time,pm2_5, pm10, o3, no2, so2);
    }
    else{
        console.log(`Weekly data unavailable`);
    }
}

function generateGraph(time,pm2_5, pm10, o3, no2, so2){
    const ctx = document.getElementById('pollutionChart').getContext('2d');

    //check weather the graph already exist
    if(window.pollutionChart && typeof window.pollutionChart.destroy === 'function') {
       window.pollutionChart.destroy(); 
    }

    //create a new chart
    window.pollutionChart = new Chart(ctx, {
        type: 'line' ,
        data: {
            labels: time,
            datasets: [
                {
                    label: 'PM2.5',
                    data: pm2_5 ,
                    borderColor: 'rgba(255, 99, 132, 1)' ,

                },
                {
                    label: 'PM10' ,
                    data: pm10 ,
                    borderColor: 'rgba(54, 162, 235, 1)',
                },
                {
                    label: 'o3' ,
                    data: o3 ,
                    borderColor: 'rgba(75, 192, 192, 1)',
                },
                {
                    label: 'no2' ,
                    data: no2 ,
                    borderColor: 'rgba(153, 102, 255, 1)',
                },
                {
                    label: 'so2' ,
                    data: so2 ,
                    borderColor: 'rgba(255, 159, 64, 1)',
                },
            ]
        },
        options: {
            responsive: true,
            scales: {
                x:{
                    display: false, //which hides the x-axis labels
                },
                y: {
                    beginAtZero: true 
                },
            }
        }
    });
    
}

//Example coordinates for San Francisco
const lat = 37.7749;
const lon = -122.4194;

//Adding AQI(Air Qulaity Index) to HTML
 

getairqualityindex(lat,lon);
getweekairqualityindex(lat,lon);
