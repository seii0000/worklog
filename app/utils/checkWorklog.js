import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import sendEmail from './sendEmail.js';

const checkWorklog = async (user) => {
  const today = new Date().toISOString().split('T')[0];
  const worklogsRef = collection(db, 'worklogs');
  const q = query(
    worklogsRef,
    where('userId', '==', user.uid),
    where('date', '==', today)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    // Người dùng chưa ghi nhật ký công việc hôm nay
    const subject = 'Nhắc nhở: Bạn chưa ghi nhật ký công việc hôm nay';
    const text = 'Xin chào, bạn quên chưa ghi nhật ký công việc hôm nay. Vui lòng đăng nhập và ghi nhật ký công việc của bạn.';
    await sendEmail(user.email, subject, text);
  }
};

export default checkWorklog;