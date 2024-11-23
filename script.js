//going to use AQICN's Air Quality API
const token = 'f18b82b48803e44b583d383200ba079fd4cac4a2';  // Your AQICN API token
const apiurl = 'https://api.waqi.info/feed/';

//url = apiurl?lat={lat}&lon={lon}&appid={apikey}

async function getairqualityindex(lat,lon) {
    try {
        const response = await fetch(`${apiurl}geo:${lat};${lon}/?token=${token}`);
        const data = await response.json();
        console.log(data);
        document.getElementById('pm2.5').innerHTML = data.data.iaqi.pm25.v;
        document.getElementById('pm10').innerHTML = data.data.iaqi.pm10.v;
        document.getElementById('o3').innerHTML = data.data.iaqi.o3.v;
        document.getElementById('no2').innerHTML = data.data.iaqi.no2.v;
        document.getElementById('so2').innerHTML = data.data.iaqi.so2.v;

        
    }

    catch(error){
        console.error("error")
    }

}

//going to use OpenWeatherMap's to fetch weekly Air Quality API
const apiKey = '23b1363ce46188a601ed51900d4a058c';
const weeklyUrl = 'https://api.openweathermap.org/data/2.5/air_pollution/history';

async function getweekairqualityindex(lat,lon) {
    const weeksInMonth = 4 ;
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate( currentDate.getDate() - 30 );
    //console.log(oneMonthAgo); TO CHECK
    //console.log(currentDate); TO CHECK

    let date = oneMonthAgo ;
    weeklyarray = [] ;

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
        weeklyarray = weeklyarray.concat(weeklydata.list);
        }
        catch(error){
            console.error('Error fetching data:', error);

        }
        //move to the next week
        date.setDate(date.getDate() + 7);
    }
    processweeklydata(weeklyarray);

}

function processweeklydata(weeklyarray) {
    if(weeklyarray && weeklyarray.length) {
        //using filter to avoid clumsyiess of 672 data
        const filterdata = weeklyarray.filter(item => {
            const date = new Date(item.dt*1000);
            return date.getHours() === 12 ;
        })
        const pollutionData = filterdata.map((item) => ({
            time: new Date(item.time.s * 1000).toLocaleString(),
            pm2_5: item.iaqi.pm25.v,
            pm10: item.iaqi.pm10.v,
            o3: item.iaqi.o3.v,
            no2: item.iaqi.no2.v,
            so2: item.iaqi.so2.v
        })); 
    console.table(pollutionData); 
    //for plotting
        time = pollutionData.map(item => item.time);
        pm2_5 = pollutionData.map(item => item.pm2_5);
        pm10 = pollutionData.map(item => item.pm10);
        o3 = pollutionData.map(item => item.o3);
        no2 = pollutionData.map(item => item.no2);
        so2 = pollutionData.map(item => item.so2);
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
                    display: false //which hides the x-axis labels
                },
                y: {
                    beginAtZero: true 
                },
            }
        }
    });
    
}

//Example coordinates for JAIN UNIVERSITY
const lat = 12.64091782473378;
const lon = 77.4405109782069;

//Adding AQI(Air Qulaity Index) to HTML
 

getairqualityindex(lat,lon);
getweekairqualityindex(lat,lon);
