# WorkLog Manager

WorkLog Manager là một ứng dụng quản lý nhật ký công việc, cho phép người dùng theo dõi và quản lý các công việc hàng ngày của họ. Ứng dụng cung cấp các tính năng như thêm, chỉnh sửa, xóa nhật ký công việc, và hiển thị biểu đồ tổng giá trị công việc theo ngày.

## Tính năng

- **Quản lý nhật ký công việc**: Thêm, chỉnh sửa, xóa nhật ký công việc.
- **Biểu đồ công việc**: Hiển thị biểu đồ tổng giá trị công việc theo ngày cho người dùng và quản trị viên.
- **Bộ lọc ngày tháng**: Lọc dữ liệu công việc theo khoảng thời gian.
- **Widget hỗ trợ**: Cung cấp chức năng hỗ trợ người dùng thông qua widget hỗ trợ.

## Cài đặt

### Yêu cầu hệ thống

- Node.js
- npm hoặc yarn
- Firebase project

### Cài đặt dự án

1. Clone repository:

   ```bash
   git clone https://github.com/yourusername/worklog-manager.git
   cd worklog-manager

2. Cài đặt các phụ thuộc:
    ```bash
    npm install

3. Cấu hình Firebase:

Tạo một dự án Firebase mới tại Firebase Console.

Tạo một tệp firebase.js trong thư mục app và cấu hình Firebase:
    ```bash
    import { initializeApp } from 'firebase/app';
    import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    export { db };

4. Chạy ứng dụng:
    ```bash
    npm run dev

Sử dụng
Trang chủ
Đăng nhập: Người dùng có thể đăng nhập bằng Google để quản lý nhật ký công việc của họ.
Đi tới nhật ký công việc: Sau khi đăng nhập, người dùng có thể đi tới trang quản lý nhật ký công việc của họ.
Quản lý nhật ký công việc
Thêm nhật ký công việc: Người dùng có thể thêm nhật ký công việc mới bằng cách điền vào form và nhấn nút "Add Worklog".
Chỉnh sửa nhật ký công việc: Người dùng có thể chỉnh sửa nhật ký công việc hiện có bằng cách nhấn vào nút "Edit" và cập nhật thông tin.
Xóa nhật ký công việc: Người dùng có thể xóa nhật ký công việc bằng cách nhấn vào nút "Delete".
Biểu đồ công việc
Biểu đồ người dùng: Hiển thị biểu đồ tổng giá trị công việc theo ngày cho người dùng hiện tại.
Biểu đồ quản trị viên: Hiển thị biểu đồ cột chồng tổng giá trị công việc theo ngày cho tất cả người dùng, giúp so sánh giá trị công việc giữa các người dùng.

Đóng góp
Nếu bạn muốn đóng góp cho dự án này, vui lòng tạo một pull request hoặc mở một issue mới trên GitHub.

Giấy phép
Dự án này được cấp phép theo giấy phép MIT. Xem tệp LICENSE để biết thêm chi tiết.


### Chạy lại ứng dụng

1. **Chạy ứng dụng**: Chạy ứng dụng của bạn.

   ```bash
   npm run dev