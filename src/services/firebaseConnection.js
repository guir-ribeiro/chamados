import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCs14ntufrc18Jdw8uLQP62y7EbHLU4ewI",
    authDomain: "chamados-1e98a.firebaseapp.com",
    projectId: "chamados-1e98a",
    storageBucket: "chamados-1e98a.appspot.com",
    messagingSenderId: "884547455318",
    appId: "1:884547455318:web:e5e4b75415585222546ef7",
    measurementId: "G-L2YG4S8PS9"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export {auth, db, storage};