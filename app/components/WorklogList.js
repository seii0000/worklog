'use client';
import { useEffect, useState } from 'react';
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
} from '@mui/material';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';

export default function WorklogList() {
  const { user } = useAuth();
  const [worklogs, setWorklogs] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'worklogs'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      }));
      setWorklogs(logs);
    });

    return () => unsubscribe();
  }, [user]);

  const exportToExcel = () => {
    const data = worklogs.map(log => ({
      'Ngày': new Date(log.date).toLocaleDateString('vi-VN'),
      'Công việc': log.task,
      'Nguồn': log.source,
      'Sản phẩm': log.product,
      'Giá thành': log.price,
      'Ghi chú': log.notes
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Worklogs");
    XLSX.writeFile(wb, "worklogs.xlsx");
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Lịch sử Worklog</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={exportToExcel}
          disabled={worklogs.length === 0}
        >
          Xuất Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Công việc</TableCell>
              <TableCell>Nguồn</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell align="right">Giá thành</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {worklogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.date.toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{log.task}</TableCell>
                <TableCell>{log.source}</TableCell>
                <TableCell>{log.product}</TableCell>
                <TableCell align="right">
                  {log.price.toLocaleString('vi-VN')} VNĐ
                </TableCell>
                <TableCell>{log.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}