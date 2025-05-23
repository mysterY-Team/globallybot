import loc from "locallium"

const debug = false
const ldb = new loc.FileDatabase("env")

export default {
    TOKEN: ldb.get("token").val,
    othertokens: ldb.get("other_tokens").val,
    db: new loc.FileDatabaseV2("db/main.db", {
        keySeparator: "/",
        getAdvancedWarns: debug,
        createDatabaseFileOnReadIfDoesntExist: true,
        setValueToDatabaseFileOnReadIfDoesntExist: "{}",
        flushTimeout: 750,
        pendingLimit: 15000,
        ramUsageFloat: 0.35,
    }),
    supportServer: {
        id: "1173722642004574359",
        gclogs: {
            main: "1261992441377062933",
            msg: "1258118372223226039",
            blocks: "1265268467167133747",
        },
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
