"use client";
import WorklogForm from '../components/WorklogForm';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Ứng dụng Nhật ký Công việc</h1>
      {user ? (
        <WorklogForm />
      ) : (
        <p className="text-center">Vui lòng đăng nhập để tạo nhật ký công việc</p>
      )}
    </main>
  );
}