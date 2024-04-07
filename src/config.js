const { initializeApp } = require("@firebase/app")

const firebaseConfig = {
    apiKey: "AIzaSyAi7Xst1KS8bKKD8T05tIs7Ind_TzTBFEY",
    authDomain: "globally2137.firebaseapp.com",
    projectId: "globally2137",
    storageBucket: "globally2137.appspot.com",
    messagingSenderId: "1031570970953",
    appId: "1:1031570970953:web:a21bb74cbe90400cfde298",
    databaseURL: "https://globally2137-default-rtdb.europe-west1.firebasedatabase.app",
}

module.exports = {
    TOKEN: "MTE3MzM1OTMwMDI5OTcxODY5Nw.GrwECS.MuGLpQw0xSarwhWwRio9enFiHpHzpUGX8WanuA",
    firebaseApp: initializeApp(firebaseConfig),
    ownersID: [
        "939641051453481020", //patyczakus
        "1166024655052738570", //patyczakusv2
        "767311735819862032", //maticola
    ],
    GCmodsID: [
        "1100856620688355415", //mikilokes
        "696985029087068202", //klekociak
        "1151184281440374926", //bermuda
        "810956435709231144", //samurara
    ],
    supportServer: {
        id: "1173722642004574359",
    },
    botID: "1173359300299718697",
    customEmoticons: {
        loading: "<:PX_loading:1174021728721195118>",
        info: "<:PX_info:1174022033366065162>",
        denided: "<:PX_deny:1174021813358055454>",
        approved: "<:PX_allow:1174021958732619838>",
        minus: "<:PX_minus:1189586820967702613>",
    },
    constPremiumServersIDs: ["1159191121939923026"],
    debug: false,
}
