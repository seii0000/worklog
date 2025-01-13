'use client';
import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Paper,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import vi from 'date-fns/locale/vi';

export default function WorklogForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: new Date(),
    task: '',
    source: '',
    product: '',
    price: '',
    notes: ''
  });
  const [alert, setAlert] = useState({ show: false, severity: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAlert({
        show: true,
        severity: 'error',
        message: 'Bạn cần đăng nhập để tạo worklog'
      });
      return;
    }

    try {
      await addDoc(collection(db, 'worklogs'), {
        ...formData,
        date: formData.date,
        price: Number(formData.price),
        userId: user.uid,
        checkedOut: false,
        createdAt: serverTimestamp(),
      });

      setAlert({
        show: true,
        severity: 'success',
        message: 'Worklog đã được lưu thành công!'
      });

      // Reset form
      setFormData({
        date: new Date(),
        task: '',
        source: '',
        product: '',
        price: '',
        notes: ''
      });
    } catch (error) {
      setAlert({
        show: true,
        severity: 'error',
        message: 'Có lỗi xảy ra khi lưu worklog'
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        {alert.show && (
          <Alert 
            severity={alert.severity} 
            sx={{ mb: 2 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}
        
        <Typography variant="h5" gutterBottom>
          Tạo Worklog Mới
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Ngày"
                value={formData.date}
                onChange={(newValue) => setFormData({...formData, date: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth />}
                format="dd/MM/yyyy"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Công việc"
                value={formData.task}
                onChange={(e) => setFormData({...formData, task: e.target.value})}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nguồn"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sản phẩm"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Giá thành"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                InputProps={{
                  endAdornment: <Typography>VNĐ</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                fullWidth
                size="large"
              >
                Lưu Worklog
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}