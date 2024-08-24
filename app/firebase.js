// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDC4xVAQDh_iXpMFU2tTF0xPOqoI8W5qfc",
    authDomain: "zalo-clone-13a33.firebaseapp.com",
    projectId: "zalo-clone-13a33",
    storageBucket: "zalo-clone-13a33.appspot.com",
    messagingSenderId: "142617015597",
    appId: "1:142617015597:web:b483b006983b209d6f8fa4",
    measurementId: "G-98XVFLPP35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);