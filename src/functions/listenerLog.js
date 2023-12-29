const { debug } = require("../config")

var listenerLog = function (space, info, priority = false) {
    if (!debug && !priority) return

    var text = ""
    for (let index = 0; index < space; index++) {
        text += "|   "
    }
    text += info

    console.log(text)
}

module.exports = {
    listenerLog: listenerLog,
}
