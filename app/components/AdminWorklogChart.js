"use client";

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminWorklogChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Work Value Distribution',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) return;

      const today = new Date().toISOString().split('T')[0];
      const q = query(collection(db, 'worklogs'), where('date', '==', today));
      const querySnapshot = await getDocs(q);
      const data = {};
      const colors = [];

      querySnapshot.forEach((doc) => {
        const { userId, price } = doc.data();
        if (data[userId]) {
          data[userId] += price;
        } else {
          data[userId] = price;
          colors.push(`hsl(${Math.random() * 360}, 100%, 75%)`);
        }
      });

      const labels = Object.keys(data);
      const values = Object.values(data);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Work Value Distribution',
            data: values,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('75%', '50%')),
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, [user]);

  return (
    <div>
      <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Work Value Distribution by User' } } }} />
    </div>
  );
};

export default AdminWorklogChart;