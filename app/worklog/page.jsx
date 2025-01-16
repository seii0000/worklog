"use client";
import WorklogForm from '../components/WorklogForm';
import { UserAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = UserAuth();

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