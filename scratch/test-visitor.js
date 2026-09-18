const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCxdmiUQVjWxT7z7Nq3U2y0o55JGTEgw18",
  authDomain: "pelayanandesagintungreja.firebaseapp.com",
  projectId: "pelayanandesagintungreja",
  storageBucket: "pelayanandesagintungreja.firebasestorage.app",
  messagingSenderId: "410953274301",
  appId: "1:410953274301:web:c9cfba53f1bf050b3b78d4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

getDoc(doc(db, 'counters', 'visitors'))
  .then(s => {
    console.log('Doc exists?', s.exists(), 'data:', s.data());
    process.exit(0);
  })
  .catch(e => {
    console.error('Error fetching doc:', e.message);
    process.exit(1);
  });
