"use client";

import React from 'react';
import UserWorklogChart from '../components/UserWorklogChart';
import AdminWorklogChart from '../components/AdminWorklogChart';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className='p-4'>
      <h1>Home Page</h1>
      {user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
        <AdminWorklogChart />
      ) : (
        <UserWorklogChart />
      )}
    </div>
  );
};

export default Home;