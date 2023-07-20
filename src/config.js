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
    TOKEN: "MTEzMDQyMzE4MTkwMDAwMTM4MQ.GxXbQs.Rj_VRoSXIh1ZFYXL2f-VhSecORGnAKqQlMj9Zg",
    firebaseApp: initializeApp(firebaseConfig),
    ownersID: [
        "939641051453481020", //patyczakus
    ],
    customEmoticons: {
        loading: "<:pixel_loading:1131168286265053276>",
        info: "<:pixel_info:1131168434160406621>",
        denided: "<:pixel_denided:1131168402933817364>",
        approved: "<:pixel_approved:1131168382067159110>",
    },
}
