"use client"; // Use client-side rendering
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { UserAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';

const Page = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [worklogs, setWorklogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Subscribe to worklogs
    const q = query(
      collection(db, 'worklogs'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorklogs(logs);
    });

    return () => unsubscribe();
  }, [user]);

  const exportToExcel = () => {
    const workbookData = worklogs.map(log => ({
      'Ngày': new Date(log.date).toLocaleDateString('vi-VN'),
      'Công việc': log.task,
      'Nguồn': log.source,
      'Sản phẩm': log.product,
      'Giá thành': log.price,
      'Ghi chú': log.notes
    }));

    const ws = XLSX.utils.json_to_sheet(workbookData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Worklogs");
    XLSX.writeFile(wb, "worklogs.xlsx");
  };

  const handleEdit = (log) => {
    const query = encodeURIComponent(JSON.stringify(log));
    router.push(`/worklog/edit?log=${query}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this worklog?")) return;

    try {
      await deleteDoc(doc(db, 'worklogs', id));
    } catch (error) {
      console.error("Error deleting worklog:", error);
      alert("Error deleting worklog");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;
  if (!user) return <p>You must be logged in to view this page - protected route.</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user.displayName}</h1>
        <button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công việc</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nguồn</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá thành</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {worklogs.map((log) => (
              log && log.date ? (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                    {new Date(log.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">{log.task}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{log.source}</td>
                  <td className="px-6 py-4 border-b border-gray-300">{log.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                    {log.price.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-6 py-4 border-b border-gray-300">{log.notes}</td>
                  <td className="px-6 py-4 border-b border-gray-300">
                    <button
                      onClick={() => handleEdit(log)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;