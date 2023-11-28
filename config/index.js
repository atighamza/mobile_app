// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKaay3u-E5gJUE1YJgbSZ9zFBKTSiSrdA",
  authDomain: "react-native-app-db3d3.firebaseapp.com",
  projectId: "react-native-app-db3d3",
  storageBucket: "react-native-app-db3d3.appspot.com",
  messagingSenderId: "227110730267",
  appId: "1:227110730267:web:ad38f07b785d57f65096be",
  measurementId: "G-D342S352HY",
};
// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export default firebase;
