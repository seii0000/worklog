"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";

const Profile = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [worklogs, setWorklogs] = useState([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (user) {
        await fetchWorklogs();
      }
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const fetchWorklogs = async () => {
    try {
      const worklogsRef = collection(db, "worklogs");
      const q = query(
        worklogsRef,
        where("userId", "==", user.uid),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      const worklogData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
      }));
      setWorklogs(worklogData);
    } catch (error) {
      console.error("Error fetching worklogs:", error);
    }
  };

  const exportToExcel = () => {
    const worklogData = worklogs.map((log) => ({
      "Ngày": log.date.toLocaleDateString("vi-VN"),
      "Công việc": log.task,
      "Nguồn": log.source,
      "Sản phẩm": log.product,
      "Giá thành": log.price,
      "Ghi chú": log.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(worklogData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Worklogs");
    XLSX.writeFile(wb, "worklogs.xlsx");
  };

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <div className="p-4">
        <Typography variant="h6">
          You must be logged in to view this page - protected route.
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome, {user.displayName}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={exportToExcel}
          sx={{ mb: 2 }}
        >
          Xuất Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="worklog table">
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Công việc</TableCell>
              <TableCell>Nguồn</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Giá thành</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {worklogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {log.date.toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>{log.task}</TableCell>
                <TableCell>{log.source}</TableCell>
                <TableCell>{log.product}</TableCell>
                <TableCell>{log.price.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell>{log.notes}</TableCell>
                <TableCell>
                  {log.checkedOut ? "Đã checkout" : "Chưa checkout"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Profile;