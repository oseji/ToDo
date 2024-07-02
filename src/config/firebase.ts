import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu8UW1PI4_F5MT9g4ucZcuDuNtny0xnFA",
  authDomain: "todo-app-9b280.firebaseapp.com",
  projectId: "todo-app-9b280",
  storageBucket: "todo-app-9b280.appspot.com",
  messagingSenderId: "1061843803983",
  appId: "1:1061843803983:web:45ea47030c5a3cebaaaf3a",
  measurementId: "G-QDV5ERWJGZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)


//const analytics = getAnalytics(app);

