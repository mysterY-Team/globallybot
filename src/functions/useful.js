import djs from "discord.js"
const { Client } = djs
import conf from "../config.js"

/**
 * @type {import("discord.js").OAuth2Guild[]}
 */
var __servers = []

var listenerLog = function (space, info, priority = false) {
    if (!conf.debug && !priority) return

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
     * @param {import("discord.js").Client<true>} client
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
 * @param {import("discord.js").Client<true>} client
 * @param {string} id
 * @param {boolean} [forced=true]
 */
async function checkUserStatus(client, id) {
    try {
        const member = await (await client.guilds.fetch(conf.supportServer.id)).members.fetch({ user: id, cache: false })
        return { inSupport: true, mysteryTeam: member.roles.cache.has("1323610813285535765"), booster: member.roles.cache.has("1182813786609045605") }
    } catch (err) {
        return { inSupport: false }
    }
}

function getModules(udata) {
    const exludeModules = ["premium"]

    return Object.keys(udata)
        .filter((x) => !exludeModules.includes(x))
        .map((x) => {
            const _x = {
                gc: "GlobalChat",
                imaca: "ImaCarrrd",
                eco: "Ekonomia",
            }
            return _x[x] || x
        })
}

/**
 *
 * @param {string} id
 * @param {number} [cachedPremium=null]
 * @returns {Promise<{ have: true, typeof: "supportBoost" | "trial" } | { have: false }>}
 */
async function botPremiumInfo(id, userstatus, cachedPremium = null) {
    if (userstatus.inSupport && userstatus.booster && !userstatus.mysteryTeam) return { have: true, typeof: "supportBoost" }
    if ((cachedPremium !== null ? cachedPremium : (await conf.db.get(`userData/${id}/premium`))?.val ?? 0) > 0) return { have: true, typeof: "trial" }
    return { have: false }
}

const repeats = (...args) => {
    const count = {}

    // Iteruj przez wszystkie argumenty
    args.forEach((value) => {
        count[value] = (count[value] || 0) + 1
    })

    // Zlicz ilość powtórzeń dla każdej wartości
    const result = {}
    for (const key in count) {
        if (count.hasOwnProperty(key)) {
            result[key] = count[key]
        }
    }

    return result
}

/**
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export { botPremiumInfo, getModules, listenerLog, wait, checkFontColor, servers, repeats, checkUserStatus }
