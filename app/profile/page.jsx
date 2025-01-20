"use client"; // Use client-side rendering
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';

const Page = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [worklogs, setWorklogs] = useState([]);
  const [language, setLanguage] = useState('en');
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
    if (!confirm(translations[language].confirmDelete)) return;

    try {
      await deleteDoc(doc(db, 'worklogs', id));
    } catch (error) {
      console.error("Error deleting worklog:", error);
      alert(translations[language].errorDelete);
    } finally {
      setLoading(false);
    }
  }

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'en' ? 'vi' : 'en'));
  };

  const translations = {
    en: {
      welcome: 'Welcome',
      export: 'Export to Excel',
      date: 'Date',
      task: 'Task',
      source: 'Source',
      product: 'Product',
      price: 'Price',
      note: 'Note',
      action: 'Action',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this worklog?',
      errorDelete: 'Error deleting worklog',
      loginRequired: 'You must be logged in to view this page - protected route.',
    },
    vi: {
      welcome: 'Chào mừng',
      export: 'Xuất ra Excel',
      date: 'Ngày',
      task: 'Công việc',
      source: 'Nguồn',
      product: 'Sản phẩm',
      price: 'Giá thành',
      note: 'Ghi chú',
      action: 'Hành động',
      edit: 'Sửa',
      delete: 'Xóa',
      confirmDelete: 'Bạn có chắc chắn muốn xóa nhật ký công việc này không?',
      errorDelete: 'Lỗi khi xóa nhật ký công việc',
      loginRequired: 'Bạn phải đăng nhập để xem trang này - trang được bảo vệ.',
    },
  };

  const t = translations[language];

  if (loading) return <Spinner />;
  if (!user) return <p>{t.loginRequired}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t.welcome}, {user.displayName}</h1>
        <div className="flex space-x-2">
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {t.export}
          </button>
          <button
            onClick={toggleLanguage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {language === 'en' ? 'Tiếng Việt' : 'English'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.date}</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.task}</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.source}</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.product}</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.price}</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.note}</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.action}</th>
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
                      {t.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      {t.delete}
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