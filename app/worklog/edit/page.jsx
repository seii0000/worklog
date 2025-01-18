"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { UserAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';

const EditWorklog = () => {
  const { user } = UserAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    date: "",
    task: "",
    source: "",
    product: "",
    price: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const logParam = searchParams.get('log');
    if (logParam) {
      const log = JSON.parse(decodeURIComponent(logParam));
      setFormData({
        date: log.date || "",
        task: log.task || "",
        source: log.source || "",
        product: log.product || "",
        price: log.price || "",
        notes: log.notes || "",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    try {
      const logParam = searchParams.get('log');
      const log = JSON.parse(decodeURIComponent(logParam));
      const docRef = doc(db, "worklogs", log.id);
      await updateDoc(docRef, {
        ...formData,
        price: parseFloat(formData.price),
      });

      alert("Worklog updated successfully!");
      router.push('/profile');
    } catch (error) {
      console.error("Error updating worklog:", error);
      alert("Error updating worklog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa nhật ký công việc</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Công việc
          </label>
          <textarea
            value={formData.task}
            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nguồn
          </label>
          <input
            type="text"
            value={formData.source}
            onChange={(e) =>
              setFormData({ ...formData, source: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sản phẩm
          </label>
          <input
            type="text"
            value={formData.product}
            onChange={(e) =>
              setFormData({ ...formData, product: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Giá thành
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ghi chú
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={2}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Cập nhật worklog"}
        </button>
      </form>
    </div>
  );
};

export default EditWorklog;