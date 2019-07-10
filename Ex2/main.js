(function () {
  const API_KEY = ''; // Add your Dark Sky API key here
  const LATITUDE = '47.223333';
  const LONGITUDE = '19.150000';

  const TOMORROW = moment().add(1, 'd').startOf('day');
  const DAY_AFTER_TOMORROW = moment().add(2, 'd').startOf('day');

  const COLOR = {
    red: [191, 33, 47],
    green: [0, 111, 60],
    blue: [38, 75, 150]
  }
  const COLOR_DIFF = COLOR.red.map((val, index) => val - COLOR.green[index]);

  const BLUE_07 = `rgba(${COLOR.blue[0]},${COLOR.blue[1]},${COLOR.blue[2]},0.7)`;
  const BLUE_08 = `rgba(${COLOR.blue[0]},${COLOR.blue[1]},${COLOR.blue[2]},0.8)`;

  function getColorGradient(ratio) {
    return [
      COLOR.green[0] + COLOR_DIFF[0] * ratio,
      COLOR.green[1] + COLOR_DIFF[1] * ratio,
      COLOR.green[2] + COLOR_DIFF[2] * ratio
    ];
  }

  function timeFilter(forecast) {
    // Filters forecasts to those on next day
    return moment.unix(forecast.time) > TOMORROW
      && moment.unix(forecast.time) <= DAY_AFTER_TOMORROW;
  }

  function forecastMap(forecast) {
    return {
      timeStamp: moment.unix(forecast.time).format('HH:mm'),
      temperature: forecast.temperature,
      precipitation: forecast.precipIntensity,
      probability: Math.round(forecast.precipProbability * 100)
    };
  }

  function drawTemperatureDiagram(labels, temperatureData) {
    const maxValue = Math.max(...temperatureData);
    const minValue = Math.min(...temperatureData);

    new Chart($('#tempForecast'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: temperatureData,
          backgroundColor: function (context) {
            const currentValue = context.dataset.data[context.dataIndex];
            const valueRatio = (currentValue - minValue) / (maxValue - minValue);
            const colorGradient = getColorGradient(valueRatio);

            return `rgba(${colorGradient[0]},${colorGradient[1]},${colorGradient[2]},0.7)`;
          },
          hoverBackgroundColor: BLUE_08,
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Temperature forecast',
          fontColor: 'black',
          fontSize: 14,
          fontStyle: 'bold'
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.yLabel} °C`;
            }
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
              stepSize: 5,
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold',
              userCallback: function (item) {
                return `${item} °C`;
              }
            }
          }]
        }
      }
    });
  }

  function drawPrecipitationDiagram(labels, precipitationData, probabilityData) {
    const maxValue = Math.max(...precipitationData);

    new Chart($('#precipForecast'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: precipitationData,
          backgroundColor: BLUE_07,
          hoverBackgroundColor: BLUE_08,
          borderWidth: 1
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Precipitation forecast',
          fontColor: 'black',
          fontSize: 14,
          fontStyle: 'bold'
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.yLabel} mm/h (Probability: ~${probabilityData[tooltipItem.index]}%)`;
            }
          }
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold'
            }
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
              min: 0,
              stepSize: maxValue / 4,
              fontColor: 'black',
              fontSize: 14,
              fontStyle: 'bold',
              userCallback: function (item) {
                return `${item.toFixed(3)} mm/h`;
              }
            }
          }]
        }
      }
    });
  }

  axios.get(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${API_KEY}/${LATITUDE},${LONGITUDE}?units=si&lang=hu`)
    .then((response) => {
      const forecastData = response.data.hourly.data.filter(timeFilter)
        .map(forecastMap);

      const labels = forecastData.map(forecast => forecast.timeStamp);
      const temperatureData = forecastData.map(forecast => forecast.temperature);
      const precipitationData = forecastData.map(forecast => forecast.precipitation);
      const probabilityData = forecastData.map(forecast => forecast.probability);

      drawTemperatureDiagram(labels, temperatureData);
      drawPrecipitationDiagram(labels, precipitationData, probabilityData);
    });
}());