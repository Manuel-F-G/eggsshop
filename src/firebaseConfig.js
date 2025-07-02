import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxIQprspppQkAPLIce8pgeVbi7zH_649c",
  authDomain: "shop-a6b2d.firebaseapp.com",
  projectId: "shop-a6b2d",
  storageBucket: "shop-a6b2d.appspot.com",
  messagingSenderId: "486333716283",
  appId: "1:486333716283:web:78525e41738b2b2d33c91e"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
