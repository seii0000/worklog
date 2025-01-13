// app/worklog/page.jsx
"use client";
import { useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const WorklogPage = () => {
  const { user } = UserAuth();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    task: '',
    source: '',
    product: '',
    price: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Thêm logic xử lý submit form tại đây
    console.log(formData);
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Please sign in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">New Worklog Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Task</label>
          <textarea
            value={formData.task}
            onChange={(e) => setFormData({...formData, task: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Source</label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) => setFormData({...formData, source: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product</label>
          <input
            type="text"
            value={formData.product}
            onChange={(e) => setFormData({...formData, product: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            rows="2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default WorklogPage;