"use client";
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminContext";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";

const AdminPage = () => {
  const { admin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [worklogs, setWorklogs] = useState([]);
  const [filteredWorklogs, setFilteredWorklogs] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [task, setTask] = useState("");

  useEffect(() => {
    if (!admin) return;

    // Lấy email admin từ biến môi trường
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    // Lấy dữ liệu từ bảng employees
    const employeesQuery = query(collection(db, "employees"));
    const unsubscribeEmployees = onSnapshot(employeesQuery, (snapshot) => {
      const employeeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredEmployees = employeeData.filter(employee => employee.email !== adminEmail);
      setEmployees(filteredEmployees);

      // Tạo đối tượng ánh xạ từ userId đến name
      const userMap = {};
      filteredEmployees.forEach((employee) => {
        userMap[employee.uid] = employee.name;
      });
      setUserMap(userMap);
    });

    // Lấy dữ liệu từ bảng worklogs
    const worklogsQuery = query(collection(db, "worklogs"));
    const unsubscribeWorklogs = onSnapshot(worklogsQuery, (snapshot) => {
      const worklogData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorklogs(worklogData);
      setFilteredWorklogs(worklogData);
      setLoading(false);
    });

    return () => {
      unsubscribeEmployees();
      unsubscribeWorklogs();
    };
  }, [admin]);

  const handleFilter = () => {
    let filtered = worklogs;

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((worklog) => new Date(worklog.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter((worklog) => new Date(worklog.date) <= end);
    }

    if (task) {
      filtered = filtered.filter((worklog) => worklog.task.toLowerCase().includes(task.toLowerCase()));
    }

    setFilteredWorklogs(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [startDate, endDate, task, worklogs]);

  if (loading) return <Spinner />;
  if (!admin) return <p>You must be logged in to view this page - protected route.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <h2 className="text-xl font-bold mb-2">Employees</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-300">{employee.name}</td>
                <td className="px-6 py-4 border-b border-gray-300">{employee.email}</td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <img src={employee.photoURL} alt={employee.name} className="w-10 h-10 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-2">Worklogs</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Task</label>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 border-b border-gray-300 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody>
            {filteredWorklogs.map((worklog) => (
              <tr key={worklog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-300">{worklog.date}</td>
                <td className="px-6 py-4 border-b border-gray-300">{worklog.task}</td>
                <td className="px-6 py-4 border-b border-gray-300">{worklog.source}</td>
                <td className="px-6 py-4 border-b border-gray-300">{worklog.product}</td>
                <td className="px-6 py-4 border-b border-gray-300">{worklog.price.toLocaleString('vi-VN')} đ</td>
                <td className="px-6 py-4 border-b border-gray-300">{worklog.notes}</td>
                <td className="px-6 py-4 border-b border-gray-300">{userMap[worklog.userId] || "Unknown User"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;