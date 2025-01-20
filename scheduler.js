import schedule from 'node-schedule';
import sendEmail from './app/utils/sendEmail.js';
import checkWorklog from './app/utils/checkWorklog.js';
import dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

// Lập lịch gửi email vào 18:00 hàng ngày
const job = schedule.scheduleJob('0 18 * * *', async function() {
  console.log('Running job to check worklog and send reminder email');
  const user = { uid: 'user-id', email: 'user-email@gmail.com' }; // Thay thế bằng thông tin người dùng thực tế
  const isWorklogLogged = await checkWorklog(user); // Kiểm tra xem worklog đã được ghi chưa
  if (!isWorklogLogged) {
    const subject = 'Nhắc nhở: Bạn chưa ghi nhật ký công việc hôm nay';
    const text = 'Xin chào, bạn quên chưa ghi nhật ký công việc hôm nay. Vui lòng đăng nhập và ghi nhật ký công việc của bạn.';
    await sendEmail(user.email, subject, text);
  }
});

console.log('Scheduler started');