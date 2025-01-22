"use client";

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminWorklogChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user data
      const userMapSnapshot = await getDocs(collection(db, 'userMap'));
      const userMap = {};
      userMapSnapshot.forEach((doc) => {
        const { name } = doc.data();
        userMap[doc.id] = name;
      });

      // Fetch worklog data
      let q = query(collection(db, 'worklogs'));
      if (startDate) {
        q = query(q, where('date', '>=', startDate));
      }
      if (endDate) {
        q = query(q, where('date', '<=', endDate));
      }
      const querySnapshot = await getDocs(q);
      const data = {};

      querySnapshot.forEach((doc) => {
        const { date, price, userId } = doc.data();
        if (!data[date]) {
          data[date] = {};
        }
        if (data[date][userId]) {
          data[date][userId] += price;
        } else {
          data[date][userId] = price;
        }
      });

      const labels = Object.keys(data);
      const userIds = new Set();
      const datasets = [];

      labels.forEach((date) => {
        Object.keys(data[date]).forEach((userId) => {
          userIds.add(userId);
        });
      });

      userIds.forEach((userId) => {
        const dataset = {
          label: userMap[userId] || userId, // Use name from userMap or fallback to userId
          data: labels.map((date) => data[date][userId] || 0),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          borderWidth: 1,
        };
        datasets.push(dataset);
      });

      setChartData({
        labels,
        datasets,
      });
    };

    fetchData();
  }, [startDate, endDate]);

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
            title: { display: true, text: 'Total Work Value by Date and User' },
          },
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
        }}
      />
    </div>
  );
};

export default AdminWorklogChart;