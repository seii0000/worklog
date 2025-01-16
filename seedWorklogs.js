const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const userId = 'ek545fVI6GWjUPDyI69v2KuJmmZ2'; // Thay thế bằng userId của bạn

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateWorklog = (date) => {
  return {
    id: uuidv4(),
    userId: userId,
    date: date.toISOString().split('T')[0],
    task: 'Công việc mẫu',
    source: 'Nguồn mẫu',
    product: 'Sản phẩm mẫu',
    price: Math.floor(Math.random() * 1000000),
    notes: 'Ghi chú mẫu',
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
};

const seedWorklogs = async () => {
  const batch = db.batch();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() - 1);

  for (let i = 0; i < 30; i++) {
    const date = generateRandomDate(endDate, startDate);
    const worklog = generateWorklog(date);
    const docRef = db.collection('worklogs').doc(worklog.id);
    batch.set(docRef, worklog);
  }

  await batch.commit();
  console.log('Worklogs seeded successfully');
};

seedWorklogs().catch(console.error);