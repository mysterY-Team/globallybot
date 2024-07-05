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
