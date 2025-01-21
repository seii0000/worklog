"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import WorklogForm from '../../components/WorklogForm';

const EditWorklog = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const logParam = searchParams.get('log');
    if (logParam) {
      const log = JSON.parse(decodeURIComponent(logParam));
      setInitialData({
        id: log.id,
        date: log.date || "",
        task: log.task || "",
        source: log.source || "",
        product: log.product || "",
        price: log.price || "",
        notes: log.notes || "",
      });
    }
  }, [searchParams]);

  const handleUpdate = async (data) => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const docRef = doc(db, "worklogs", initialData.id);
      await updateDoc(docRef, data);

      alert("Worklog updated successfully!");
      router.push('/profile');
    } catch (error) {
      console.error("Error updating worklog:", error);
      alert("Error updating worklog");
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa nhật ký công việc</h1>
      <WorklogForm initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditWorklog;