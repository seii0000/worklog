"use client";
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../context/AdminContext";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { XIcon } from '@heroicons/react/solid';

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
  const [source, setSource] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedWorklog, setSelectedWorklog] = useState(null);

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

    if (source) {
      filtered = filtered.filter((worklog) => worklog.source.toLowerCase().includes(source.toLowerCase()));
    }

    if (product) {
      filtered = filtered.filter((worklog) => worklog.product.toLowerCase().includes(product.toLowerCase()));
    }

    if (price) {
      filtered = filtered.filter((worklog) => worklog.price === parseFloat(price));
    }

    if (selectedUser) {
      filtered = filtered.filter((worklog) => worklog.userId === selectedUser);
    }

    setFilteredWorklogs(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [startDate, endDate, task, worklogs, source, product, price, selectedUser]);

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const handleWorklogClick = (worklog) => {
    setSelectedWorklog(worklog);
  };

  const handleCloseDetail = () => {
    setSelectedWorklog(null);
  };

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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">User</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Users</option>
          {employees.map((employee) => (
            <option key={employee.uid} value={employee.uid}>
              {employee.name}
            </option>
          ))}
        </select>
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
              <tr key={worklog.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleWorklogClick(worklog)}>
                <td className="px-6 py-4 border-b border-gray-300">{worklog.date}</td>
                <td className="px-6 py-4 border-b border-gray-300">{truncateText(worklog.task, 50)}</td>
                <td className="px-6 py-4 border-b border-gray-300">{truncateText(worklog.source, 50)}</td>
                <td className="px-6 py-4 border-b border-gray-300">{truncateText(worklog.product, 50)}</td>
                <td className="px-6 py-4 border-b border-gray-300">{worklog.price.toLocaleString('vi-VN')} đ</td>
                <td className="px-6 py-4 border-b border-gray-300">{truncateText(worklog.notes, 50)}</td>
                <td className="px-6 py-4 border-b border-gray-300">{userMap[worklog.userId] || "Unknown User"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedWorklog && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50" onClick={handleCloseDetail}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCloseDetail}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Chi tiết Worklog</h2>
            <p><strong>Date:</strong> {selectedWorklog.date}</p>
            <p><strong>Task:</strong> {selectedWorklog.task}</p>
            <p><strong>Source:</strong> {selectedWorklog.source}</p>
            <p><strong>Product:</strong> {selectedWorklog.product}</p>
            <p><strong>Price:</strong> {selectedWorklog.price.toLocaleString('vi-VN')} đ</p>
            <p><strong>Notes:</strong> {selectedWorklog.notes}</p>
            <p><strong>User:</strong> {userMap[selectedWorklog.userId] || "Unknown User"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;