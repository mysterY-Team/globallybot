const { Client, OAuth2Guild } = require("discord.js")
const { debug } = require("../config")

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
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = {
    listenerLog: listenerLog,
    wait,
    servers,
}
