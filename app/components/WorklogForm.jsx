"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';

const WorklogForm = ({ initialData = {}, onSubmit }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState(initialData.task || '');
  const [source, setSource] = useState(initialData.source || '');
  const [product, setProduct] = useState(initialData.product || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [date, setDate] = useState(initialData.date || new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData.date) {
      setDate(initialData.date);
    }
  }, [initialData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to submit a worklog.');
      return;
    }

    setLoading(true);

    try {
      const data = {
        userId: user.uid,
        task,
        source,
        product,
        price: parseFloat(price),
        notes,
        date: date,
        createdAt: Timestamp.now(),
      };

      if (initialData.id) {
        // Update existing worklog
        const docRef = doc(db, 'worklogs', initialData.id);
        await updateDoc(docRef, data);
      } else {
        // Add new worklog
        await addDoc(collection(db, 'worklogs'), data);
      }

      router.push('/profile');
    } catch (error) {
      console.error('Error submitting worklog:', error);
      alert('Error submitting worklog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{initialData.id ? 'Edit Worklog' : 'New Worklog'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="task">
          Task
        </label>
        <input
          type="text"
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="source">
          Source
        </label>
        <input
          type="text"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product">
          Product
        </label>
        <input
          type="text"
          id="product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData.id ? 'Update Worklog' : 'Add Worklog'}
        </button>
      </div>
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="loader"></div>
        </div>
      )}
    </form>
  );
};

export default WorklogForm;