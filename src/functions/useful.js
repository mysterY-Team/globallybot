const { Client, OAuth2Guild } = require("discord.js")
const { debug, supportServer } = require("../config")

/**
 * @type {OAuth2Guild[]}
 */
var __servers = []

var listenerLog = function (space, info, priority = false) {
    if (!debug && !priority) return

    var text = ""
    for (let index = 0; index < space; index++) {
        text += "|   "
    }
    text += info

    console.log(text)
}

const servers = {
    /**
     *
     * @param {Client<true>} client
     * @returns {Promise<number>}
     */
    async fetch(client) {
        const oldL = __servers.length
        __servers = (await client.guilds.fetch()).map((x) => x)
        return __servers.length - oldL
    },
    get() {
        return __servers
    },
}

/**
 * @param {string} bgHEX
 */
function checkFontColor(bgHEX) {
    // Zamień kolor tła na wartość liczbową RGB
    const r = parseInt(bgHEX.slice(1, 3), 16)
    const g = parseInt(bgHEX.slice(3, 5), 16)
    const b = parseInt(bgHEX.slice(5, 7), 16)

    // Oblicz jasność tła (średnią arytmetyczną kanałów RGB)
    const jasnosc = (r + g + b) / 3

    // Wybierz kolor czcionki na podstawie jasności tła
    if (jasnosc > 128) {
        return "black" // Czarna czcionka na jasnym tle
    } else {
        return "white" // Biała czcionka na ciemnym tle
    }
}

/**
 *
 * @param {Client<true>} client
 * @param {string} id
 * @param {boolean} [forced=true]
 */
async function checkUserStatusInSupport(client, id, forced = true) {
    try {
        const member = await (await client.guilds.fetch(supportServer.id)).members.fetch({ user: { id: id }, force: forced })
        return { in: true, mysteryTeam: member.roles.cache.has("1264341114941472848") }
    } catch (err) {
        return { in: false }
    }
}

/**
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = {
    listenerLog: listenerLog,
    wait,
    checkFontColor,
    servers,
    checkUserStatusInSupport,
}
