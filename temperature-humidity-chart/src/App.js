import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from MockAPI
  useEffect(() => {
    axios.get('https://67d58d2f286fdac89bbfaa45.mockapi.io/api/chart/Temperature')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, []);

  // Prepare data for chart.js
  const fields = [...new Set(data.map(item => item.field))]; // Unique fields
  const temperatureData = fields.map(field => data.filter(item => item.field === field).map(item => item.temperature));
  const humidityData = fields.map(field => data.filter(item => item.field === field).map(item => item.humidity));

  const chartData = {
    labels: data.length > 0 ? data.map(item => item.date) : [], // X-axis labels (dates)
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData.flat(),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
      {
        label: 'Humidity',
        data: humidityData.flat(),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div className="App">
      <h1>Temperature and Humidity Chart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default App;
