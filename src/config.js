const loc = require("locallium")

const debug = false

const ldb = new loc.Database("env")

loc.Database
module.exports = {
    TOKEN: ldb.get("token").val,
    db: new loc.Database(
        "db/main.db",
        new loc.DatabaseFlags({
            keySeparator: "/",
            getAdvancedWarns: debug,
            keepEmptyKeysWhileDeleting: true,
        })
    ),
    ownersID: [
        "1166024655052738570", //patyczakus
        "767311735819862032", //maticola
    ],
    GCmodsID: [
        "1151184281440374926", //bermuda
        "810956435709231144", //samurara
        "1197864787200180224", //calebinioziom
        "442781147685191700", //chudoku
        "1229391384054726717", //panmysz
        "966764089126826044", //rikens
        "1047887249536204822", //bagietka
        "1100856620688355415", //mikilokes
    ],
    supportServer: {
        id: "1173722642004574359",
        gclogID: "1258118372223226039",
    },
    _bot: {
        id: ldb.get("bid").val,
    },
    customEmoticons: {
        loading: "<:PX_loading:1174021728721195118>",
        info: "<:PX_info:1174022033366065162>",
        denided: "<:PX_deny:1174021813358055454>",
        approved: "<:PX_allow:1174021958732619838>",
        minus: "<:PX_minus:1189586820967702613>",
    },
    constPremiumServersIDs: ["1159191121939923026", "1245039603635716179"],
    debug,
}
