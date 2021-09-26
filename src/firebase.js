import { initializeApp } from "firebase/app"
// import  "firebase/compat/firestore"
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId:process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId:process.env.REACT_APP_measurementId
   
  };


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)


export default db;