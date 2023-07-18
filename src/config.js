require("dotenv").config()
const { initializeApp } = require("@firebase/app")

const firebaseConfig = {
    apiKey: "AIzaSyAi7Xst1KS8bKKD8T05tIs7Ind_TzTBFEY",
    authDomain: "globally2137.firebaseapp.com",
    projectId: "globally2137",
    storageBucket: "globally2137.appspot.com",
    messagingSenderId: "1031570970953",
    appId: "1:1031570970953:web:a21bb74cbe90400cfde298",
    databaseURL:
        "https://globally2137-default-rtdb.europe-west1.firebasedatabase.app",
}

module.exports = {
    TOKEN: process.env.token,
    firebaseApp: initializeApp(firebaseConfig),
}
