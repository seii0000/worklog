"use client";

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserWorklogChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Work Value',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      let q = query(collection(db, 'worklogs'), where('userId', '==', user.uid));
      if (startDate) {
        q = query(q, where('date', '>=', startDate));
      }
      if (endDate) {
        q = query(q, where('date', '<=', endDate));
      }
      const querySnapshot = await getDocs(q);
      const data = {};

      querySnapshot.forEach((doc) => {
        const { date, price } = doc.data();
        if (data[date]) {
          data[date] += price;
        } else {
          data[date] = price;
        }
      });

      const labels = Object.keys(data);
      const values = Object.values(data);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Work Value',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, [user, startDate, endDate]);

  return (
    <div>
      <div className="flex justify-center mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mr-2 p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Total Work Value by Date' },
          },
        }}
      />
    </div>
  );
};

export default UserWorklogChart;