// src/components/EventChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';

const EventChart = ({ data }: { data: any }) => {
  const chartData = {
    labels: data.map((event: any) => event.timestamp),
    datasets: [
      {
        label: 'Eventos',
        data: data.map((event: any) => event.value),
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'lightblue',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default EventChart;
