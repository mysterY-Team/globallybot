import djs from "discord.js"
import conf from "./config.js"
import fs from "fs"
import uc from "./interactions/cmds/globalchat/unicode.js"
import { listenerLog, wait, checkUserStatus, botPremiumInfo } from "./functions/useful.js"
import { checkAnyBadWords } from "./functions/badwords.js"
import { gcdata, gcdataGuild } from "./functions/dbSystem.js"
import { request } from "undici"
const { Client, Message, EmbedBuilder, WebhookClient, WebhookMessageCreateOptions, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, DiscordAPIError } = djs
const { db, customEmoticons, debug, supportServer, _bot } = conf
const { unicodeList } = uc

const userCooldown = (amount, type = 0) => 6000 - 300 * type + (500 - 50 * type) * amount
let lastUser = "unknown"

/**
 *
 * @param {string} text
 */
function checkDisallowedLinks(text) {
    /**
     * @type {(RegExp | string)[]}
     */
    const linkList = [
        // blokada linków zaproszeniowych
        /(?:http[s]?:\/\/)?(?:www.|ptb.|canary.)?(?:discord(?:app)?.(?:(?:com|gg)\/(?:invite|servers)\/[a-z0-9-_]+)|discord.gg\/[a-z0-9-_]+)|(?:http[s]?:\/\/)?(?:www.)?(?:dsc.gg|invite.gg+|discord.link|(?:discord.(gg|io|me|li|id))|disboard.org)\/[a-z0-9-_\/]+/gim,
        /(?:http[s]?:\/\/)?(?:www.)discordzik.pl\/(?:bot|server)\/[0-9]{17,19}/gim,

        // blokada linków do stron dla dorosłych
        "pornhub.com", //typowe
        "xvideos.com",
        "xhamster.com",
        "xnxx.com",
        "youporn.com",
        "redtube.com",
        "porn.com",
        "tube8.com",
        "ixxx.com",
        "sunporno.com",
        "pornhat.com",
        "hentaihaven.xxx", //hentaice
        "hentaigasm.com",
        "fakku.net",
        "gelbooru.com",
        "porcore.com",
        "cartoonporno.xxx",
        "adulttime.xxx",
        "ichatonline.com", //kamerki
        "stripchat.pl",
        "stripchat.com",
        "bongacams.com",
        "bongocams.net",
        "smutcam.com",
        "toppornsites.com", //listy
        "mypornbible.com",
        "badjojo.com",
        "findtubes.com",
        "pornmd.com",
        "nutaku.net", //sieci gier
        "porngameshub.com",
        "69games.xxx",
        "gamcore.com",
        "gamesofdesire.com",
        "hooligapps.com",
        "sexgamesclub.com",
        "lifeselector.com",
        "sexemulator.com",
    ]

    for (let i = 0; i < linkList.length; i++) {
        if (typeof linkList[i] === "string" && text.includes(linkList[i])) return true
        else if (typeof linkList[i] === "object" && linkList[i] instanceof RegExp && linkList[i].test(text)) return true
    }

    return false
}

/**
 *
 * @param {string} text
 * @param {Client<true>} client
 * @returns {Promise<string>}
 */
async function formatText(text, client) {
    if (text.match(/{(?:unicode|uc):([^`\n}\s]+)}/g)) {
        var ucInfo = {}
        unicodeList.forEach((ucinfo) => {
            ucinfo.savenames.forEach((name) => {
                ucInfo[name] = ucinfo.symbol
            })
        })
    }

    text = text.replace(/{(?:unicode|uc):([^`\n}\s]+)}/g, (match, arg1) => {
        return ucInfo[arg1] ?? customEmoticons.minus
    })
    text = text.replace(/{(?:textFormat|txf)\.mix:([^`\n}]+)}/g, (match, arg1) => {
        var text = ""
        for (let i = 0; i < arg1.length; i++) {
            if (i % 2) text += arg1[i].toUpperCase()
            else text += arg1[i].toLowerCase()
        }
        return text
    })
    text = text.replace(/{(?:textFormat|txf)\.(doubleline|gothic|sup):([^`\n}]+)}/g, (match, arg1, arg2) => {
        const formatLetters = {
            doubleline: {
                A: "𝔸",
                B: "𝔹",
                C: "ℂ",
                D: "𝔻",
                E: "𝔼",
                F: "𝔽",
                G: "𝔾",
                H: "ℍ",
                I: "𝕀",
                J: "𝕁",
                K: "𝕂",
                L: "𝕃",
                M: "𝕄",
                N: "ℕ",
                O: "𝕆",
                P: "ℙ",
                Q: "ℚ",
                R: "ℝ",
                S: "𝕊",
                T: "𝕋",
                U: "𝕌",
                V: "𝕍",
                W: "𝕎",
                X: "𝕏",
                Y: "𝕐",
                Z: "ℤ",
                a: "𝕒",
                b: "𝕓",
                c: "𝕔",
                d: "𝕕",
                e: "𝕖",
                f: "𝕗",
                g: "𝕘",
                h: "𝕙",
                i: "𝕚",
                j: "𝕛",
                k: "𝕜",
                l: "𝕝",
                m: "𝕞",
                n: "𝕟",
                o: "𝕠",
                p: "𝕡",
                q: "𝕢",
                r: "𝕣",
                s: "𝕤",
                t: "𝕥",
                u: "𝕦",
                v: "𝕧",
                w: "𝕨",
                x: "𝕩",
                y: "𝕪",
                z: "𝕫",
                0: "𝟘",
                1: "𝟙",
                2: "𝟚",
                3: "𝟛",
                4: "𝟜",
                5: "𝟝",
                6: "𝟞",
                7: "𝟟",
                8: "𝟠",
                9: "𝟡",
            },
            gothic: {
                A: "𝕬",
                B: "𝕭",
                C: "𝕮",
                D: "𝕯",
                E: "𝕰",
                F: "𝕱",
                G: "𝕲",
                H: "𝕳",
                I: "𝕴",
                J: "𝕵",
                K: "𝕶",
                L: "𝕷",
                M: "𝕸",
                N: "𝕹",
                O: "𝕺",
                P: "𝕻",
                Q: "𝕼",
                R: "𝕽",
                S: "𝕾",
                T: "𝕿",
                U: "𝖀",
                V: "𝖁",
                W: "𝖂",
                X: "𝖃",
                Y: "𝖄",
                Z: "𝖅",
                a: "𝖆",
                b: "𝖇",
                c: "𝖈",
                d: "𝖉",
                e: "𝖊",
                f: "𝖋",
                g: "𝖌",
                h: "𝖍",
                i: "𝖎",
                j: "𝖏",
                k: "𝖐",
                l: "𝖑",
                m: "𝖒",
                n: "𝖓",
                o: "𝖔",
                p: "𝖕",
                q: "𝖖",
                r: "𝖗",
                s: "𝖘",
                t: "𝖙",
                u: "𝖚",
                v: "𝖛",
                w: "𝖜",
                x: "𝖝",
                y: "𝖞",
                z: "𝖟",
                0: "𝟎",
                1: "𝟏",
                2: "𝟐",
                3: "𝟑",
                4: "𝟒",
                5: "𝟓",
                6: "𝟔",
                7: "𝟕",
                8: "𝟖",
                9: "𝟗",
            },
            sup: {
                A: "ᴬ",
                B: "ᴮ",
                C: "ꟲ",
                D: "ᴰ",
                E: "ᴱ",
                F: "ꟳ",
                G: "ᴳ",
                H: "ᴴ",
                I: "ᴵ",
                J: "ᴶ",
                K: "ᴷ",
                L: "ᴸ",
                M: "ᴹ",
                N: "ᴺ",
                O: "ᴼ",
                P: "ᴾ",
                Q: "ꟴ",
                R: "ᴿ",
                T: "ᵀ",
                U: "ᵁ",
                V: "ⱽ",
                W: "ᵂ",
                a: "ᵃ",
                b: "ᵇ",
                c: "ᶜ",
                d: "ᵈ",
                e: "ᵉ",
                f: "ᶠ",
                g: "ᵍ",
                h: "ʰ",
                i: "ⁱ",
                j: "ʲ",
                k: "ᵏ",
                l: "ˡ",
                m: "ᵐ",
                n: "ⁿ",
                o: "ᵒ",
                p: "ᵖ",
                q: "𐞥",
                r: "ʳ",
                s: "ˢ",
                t: "ᵗ",
                u: "ᵘ",
                v: "ᵛ",
                w: "ʷ",
                x: "ˣ",
                y: "ʸ",
                z: "ᶻ",
                0: "⁰",
                1: "¹",
                2: "²",
                3: "³",
                4: "⁴",
                5: "⁵",
                6: "⁶",
                7: "⁷",
                8: "⁸",
                9: "⁹",
                "+": "⁺",
                "-": "⁻",
                "=": "⁼",
                "(": "⁽",
                ")": "⁾",
            },
        }

        let rtext = ""

        for (let i = 0; i < arg2.length; i++) rtext += formatLetters[arg1][arg2[i]] ?? arg2[i]

        return rtext
    })

    // let matches = text.match(/{(?:serverEmote|se)\.([0-9]{17,19}):([a-zA-Z0-9_]+)}/g)
    // if (matches) {
    //     for (let match of matches) {
    //         let [$, arg1, arg2] = /{(?:serverEmote|se)\.([0-9]{17,19}):([a-zA-Z0-9_]+)}/.exec(match)
    //         try {
    //             const emojis = await (await client.guilds.fetch({ guild: arg1, cache: false })).emojis.fetch()
    //             if (emojis.map((x) => x.name).includes(arg2)) {
    //                 const emoji = emojis.map((x) => x)[emojis.map((x) => x.name).indexOf(arg2)]
    //                 text = text.replace(match, `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`)
    //             } else {
    //                 text = text.replace(match, customEmoticons.minus)
    //             }
    //         } catch (e) {
    //             text = text.replace(match, customEmoticons.minus)
    //         }
    //     }
    // }

    return text
}

/**
 *
 * @param {string} text
 * @returns {string}
 */
function deleteComments(text) {
    text = text.split("```")
    for (let i = 0; i < text.length; i++) {
        text[i] = {
            text: text[i],
            isInCode: i % 2 == 0 ? false : true,
        }
    }
    text = text.map(function (x) {
        if (!x.isInCode) {
            x.text = x.text
                .split("\n")
                .filter((c) => !c.startsWith("<##> "))
                .join("\n")
        }

        return x
    })
    text = text.map((x) => x.text).join("```")

    return text
}
/**
 * GlobalChat, edycja czwarta, wersja druga systemu
 * @param {Client<true>} client
 * @param {Message<true>} message
 */
export async function globalchatFunction(client, message) {
    try {
        const ssstatus = await checkUserStatus(client, message.author.id, false)
        var isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        var GClocation = `${message.guildId}/${message.channelId}`
        var accDate = new Date()
        accDate = `${accDate.getFullYear()}-${accDate.getMonth() + 1}-${accDate.getDate()}`
        var gcapprovedAttachments = message.attachments.filter(
            (x) => x.contentType && (x.contentType.startsWith("image") || x.contentType.startsWith("video") || x.contentType.startsWith("audio"))
        )
        var userHasPremium = (await botPremiumInfo(message.author.id, ssstatus)).have

        const oldUserSnapshot = await db.aget(`userData/${message.author.id}/gc`)
        var userData = gcdata.encode(oldUserSnapshot.val)
        if ((!deleteComments(message.content) && gcapprovedAttachments.size == 0) || message.content.startsWith("<###>")) return

        if (message.author.bot || message.author.system) return

        var snpsht = await db.aget(`serverData`)
        /**
         * @type {Array<{ id: string, gc: Object }}
         */
        var database = snpsht.val || {}

        database = Object.entries(database)
            .filter(([n, server]) => "gc" in server)
            .map(([id, data]) => {
                return { id: id, gc: gcdataGuild.encode(data.gc) }
            })

        var getDataByServerID = (id, classification = "serverID") => {
            var x = database.find((x) => x[classification] == id) ?? null
            return x
        }

        var serverdata = getDataByServerID(message.guildId, "id")

        // console.log(Object.values(serverdata?.gc || {}))
        if (!Object.values(serverdata?.gc || {}).find((x) => x.channel === message.channelId)) return

        listenerLog(2, "")
        listenerLog(2, "❗ Wyłapano wiadomość do GC!")
        listenerLog(3, "Data serwera: " + JSON.stringify(serverdata))
    } catch (err) {
        if (debug) console.error(err)
        return
    }

    try {
        function wbName(modPerm, data) {
            if (modPerm === 4) var rank = "st. naczelnik"
            else if (modPerm === 3) var rank = "naczelnik"
            else if (modPerm === 2) var rank = "st. moderator"
            else if (modPerm === 1) var rank = "moderator"
            else var rank = "użytkownik"

            if (userHasPremium) rank += "+"
            if (isInMysteryTeam) rank = "mysterY"

            if (data.flag_showGCButtons)
                return data.flag_wbUserName
                    .replace(/%username%/i, message.author.username)
                    .replace(/%userid%/i, message.author.id)
                    .replace(/%userrole%/i, rank)
                    .replace(/%guildid%/i, message.guildId)
                    .replace(/%guildname%/i, message.guild.name)
            /* else */ return `${message.author.username} (${rank};${message.author.id};${message.guildId})`
        }

        const chpermissions = message.channel.permissionsFor(_bot.id, false)

        listenerLog(3, "➿ Spełniono warunek (1/5)")

        var station = Object.values(serverdata.gc)
            .map((x) => x.channel)
            .indexOf(message.channelId)
        station = Object.keys(serverdata.gc)[station]

        /**
         * @returns {Promise<[EmbedBuilder, string] | undefined>}
         */
        var repliedMessage = async function (gID) {
            if (gID && message.reference) {
                try {
                    var replayedMSG = await message.fetchReference(),
                        rContent = replayedMSG.content,
                        rAttachments

                    if (!replayedMSG.author.bot) {
                        return
                    }

                    if (serverdata.gc[station].createdTimestamp > replayedMSG.createdTimestamp) {
                        return
                    }

                    rContent = deleteComments(rContent)

                    if (replayedMSG.author.username.includes("GlobalAction")) {
                        var ruid = "GlobalAction",
                            rUser = replayedMSG.author.username.split("(")[0].split(" aka ").at(-1).trim() + " (GlobalAction)"
                    } else if (serverdata.gc[station].flag_showGCButtons) {
                        var ruid = null,
                            rUser = (() => {
                                const blockRegexFunctions = (string) => string.replace(/(\\|\.|\*|\[|\]|\||\^|\$|\(|\)|\*|\+)/g, "\\$1")

                                const usernametagIndex = serverdata.gc[station].flag_wbUserName.indexOf("%username%")
                                let separators = {
                                    before: "",
                                    after: "",
                                }
                                let getFlags = {
                                    start: true,
                                    end: true,
                                }

                                for (let i = usernametagIndex - 1; i >= 0; i--) {
                                    if (serverdata.gc[station].flag_wbUserName[i] === "%") {
                                        getFlags.start = false
                                        break
                                    }
                                    separators.before = serverdata.gc[station].flag_wbUserName[i] + separators.before
                                }

                                for (let i = usernametagIndex + "%username%".length; i < serverdata.gc[station].flag_wbUserName.length; i++) {
                                    if (serverdata.gc[station].flag_wbUserName[i] === "%") {
                                        getFlags.end = false
                                        break
                                    }
                                    separators.after += serverdata.gc[station].flag_wbUserName[i]
                                }

                                const usernameRegexPart = "[a-z0-9._]{2,32}"

                                const regex1 = RegExp(
                                    `${getFlags.start ? "^" : ""}${blockRegexFunctions(separators.before)}(${usernameRegexPart})${blockRegexFunctions(separators.after)}${
                                        getFlags.end ? "$" : ""
                                    }`,
                                    "g"
                                )
                                const regex2 = RegExp(
                                    `${getFlags.start ? "^" : ""}${blockRegexFunctions(separators.before)}(${usernameRegexPart}|%username%)${blockRegexFunctions(
                                        separators.after
                                    )}${getFlags.end ? "$" : ""}`,
                                    "g"
                                )

                                listenerLog(3, "Wykonanie odpowiedzi...")

                                let a1, a2

                                while ((a1 = regex1.exec(replayedMSG.author.username)) && (a2 = regex2.exec(serverdata.gc[station].flag_wbUserName))) {
                                    if (a1.index === regex1.lastIndex) {
                                        regex1.lastIndex++
                                    }
                                    if (a2.index === regex2.lastIndex) {
                                        regex2.lastIndex++
                                    }

                                    listenerLog(4, `${a1[1]} vs ${a2[1]}`)
                                    if (a1[1] !== a2[1]) {
                                        return a1[1]
                                    }
                                }

                                return null
                            })()
                    } else {
                        var ruid = replayedMSG.author.username.split(" (")[1]?.split(";")[1].trim() ?? null,
                            rUser = replayedMSG.author.username.split(" (")[0]
                    }

                    var embed = { iconURL: replayedMSG.author.avatarURL({ extension: "png" }), name: `W odpowiedzi do ${rUser}` }
                    if (gID == message.guildId) embed.url = replayedMSG.url
                    embed = new EmbedBuilder().setAuthor(embed).setTimestamp(replayedMSG.createdTimestamp)
                    if (rContent) embed = embed.setDescription(rContent)
                    if (gID == message.guildId) embed = embed.setFooter({ text: "Kliknięcie w nagłówek spowoduje przeniesienie do odpowiadanej wiadomości" })
                    if (replayedMSG.attachments.size > 0) {
                        rAttachments = replayedMSG.attachments.map((x) => `[\`${x.name}\`](${x.url})`).join("\n")
                        if (rAttachments.length > 1000) rAttachments = replayedMSG.attachments.map((x) => x.url).join("\n")
                        if (rAttachments.length > 1000) rAttachments = replayedMSG.attachments.map((x) => `\`${x.name}\``).join("\n")
                        if (rAttachments.length > 1000) rAttachments = `[ plików: ${replayedMSG.attachments.size} ]`
                        embed = embed.addFields({ name: "Przesłane pliki", value: rAttachments })
                    }

                    return [embed, ruid]
                } catch (e) {
                    console.warn(e)
                }
            }
        }

        const stationSnapshot = await db.aget(`stations/${station}`)

        if (!stationSnapshot.exists) {
            let msg = await message.channel.send("Ta stacja przestała istnieć! Usuwanie kanału z bazy danych...")
            let removeData = async function () {
                delete serverdata.gc[station]
                if (Object.keys(serverdata.gc).length > 0) await db.aset(`serverData/${serverdata.id}/gc`, gcdataGuild.decode(serverdata.gc))
                else await db.adelete(`serverData/${serverdata.id}/gc`)
                msg.edit(`~~Ta stacja przestała istnieć! Usuwanie kanału z bazy danych...~~\n${customEmoticons.approved} Usunięto kanał z bazy danych!`)

                const emb = new EmbedBuilder()
                    .setTitle("Usunięto kanał!")
                    .setDescription(`ID: \`${message.channel.id}\`\nNazwa kanału: \`${message.channel.name}\`\nStacja: \`${station}\`\nOsoba odłączająca: <@${_bot.id}>`)
                    .setColor("Blue")
                await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send({ embeds: [emb] })
            }

            if (serverdata.gc[station].webhook !== "none") {
                let webhook = new WebhookClient({
                    url: "https://discord.com/api/webhooks/" + serverdata.gc[station].webhook,
                })
                request("https://discord.com/api/webhooks/" + serverdata.gc[station].webhook)
                    .then((res) => {
                        try {
                            if (res.statusCode >= 200 && res.statusCode < 300) webhook.delete("braku stacji")
                        } catch (e) {}

                        removeData()
                    })
                    .catch(() => {
                        removeData()
                    })
            } else {
                removeData()
            }

            return
        }

        const stationHasPasswd = Boolean((await db.aget(`stations/${station}`)).val.split("|")[1])

        listenerLog(3, "➿ Spełniono warunek (2/5)")

        if (userData.timestampToSendMessage - 500 > Date.now()) {
            message.react(customEmoticons.denided)
            if (message.content.toLowerCase() !== "<p>")
                var info = `\n${customEmoticons.info} Możesz cofnąć **tą** zablokowaną wiadomość za pomocą znacznika \`<p>\`. Po prostu to wpisz po usunięciu tej wiadomości, aby to ją właśnie użyć`

            if (chpermissions.has("ReadMessageHistory"))
                var msg = message.reply(
                    `${customEmoticons.denided} Jesteś objęty/-a cooldownem! Zaczekaj jeszcze \`${userData.timestampToSendMessage - Date.now()}\` ms${info ?? ""}`
                )
            else
                var msg = message.channel.send(
                    `${customEmoticons.denided} ${message.author}, jesteś objęty/-a cooldownem! Zaczekaj jeszcze \`${userData.timestampToSendMessage - Date.now()}\` ms${
                        info ?? ""
                    }`
                )

            info = null

            msg.then(async (msg) => {
                await wait(Math.max(userData.timestampToSendMessage - Date.now(), 3000))
                msg.delete()
            })

            if (message.content.toLowerCase() !== "<p>") {
                userData.messageID_bbc = message.id
                await db.aset(`userData/${message.author.id}/gc`, gcdata.decode(userData))
            }
            return
        }

        userData.timestampToSendMessage = Date.now() + 2000
        db.aset(`userData/${message.author.id}/gc`, gcdata.decode(userData))
        await wait(Math.max(userData.timestampToSendMessage - Date.now(), 0))

        database = database.filter((x) => Object.keys(x.gc).includes(station)).map((x) => Object.assign(x.gc[station], { serverID: x.id }))

        listenerLog(3, "➿ Spełniono warunek (3/5)")

        if (userData.isBlocked) {
            message.react(customEmoticons.denided)
            return
        }

        listenerLog(3, "➿ Spełniono warunek (4/5)")

        if (message.content.toLowerCase() === "<p>" && userData.messageID_bbc) {
            if (message.deletable) message.delete()
            try {
                const msg = await message.channel.messages.fetch({ message: userData.messageID_bbc, cache: false })

                message = msg
                userData.messageID_bbc = ""
            } catch (e) {
                message.react(customEmoticons.denided)
                return
            }
        } else if (message.content.toLowerCase() === "<p>" && !userData.messageID_bbc) {
            message.react(customEmoticons.minus)
            return
        }

        //---

        if (checkDisallowedLinks(deleteComments(message.content)) && !isInMysteryTeam) {
            message.react(customEmoticons.denided)
            try {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Blokada linku" })
                    .setFields({ name: "Powód", value: "Niedozwolony link", inline: true }, { name: "Kara", value: "10 minut osobistego cooldownu", inline: true })
                    .setFooter({ text: "Globally, powered by mysterY" })
                    .setColor("Red")
                message.channel.send({ embeds: [embed] })
            } catch (e) {}
            userData.timestampToSendMessage = Date.now() + 600_000
            userData.messageID_bbc = ""
            await db.aset(`userData/${message.author.id}/gc`, gcdata.decode(userData))
            return
        }

        listenerLog(3, "Ilość karmy: " + userData.karma)
        if (userData.karma < 25n && !stationHasPasswd) {
            if (deleteComments(message.content).match(/(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_=]*)?/)) {
                message.react(customEmoticons.denided)
                try {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: "Blokada linku" })
                        .setFields({ name: "Powód", value: "Za mała ilość karmy", inline: true }, { name: "Kara", value: "30 sekund osobistego cooldownu", inline: true })
                        .setFooter({ text: "Globally, powered by mysterY" })
                        .setColor("Red")
                    message.channel.send({ embeds: [embed] })
                } catch (e) {}
                userData.timestampToSendMessage = Date.now() + 30_000
                userData.messageID_bbc = ""
                await db.aset(`userData/${message.author.id}/gc`, gcdata.decode(userData))
                return
            }
            if (!userHasPremium) {
                var mustInform = gcapprovedAttachments.size > 0
                gcapprovedAttachments = gcapprovedAttachments.filter(() => false)
            }
        }

        if (!deleteComments(message.content) && gcapprovedAttachments.size == 0) {
            message
                .reply(`${customEmoticons.info} Posiadasz mniej niż 25 karmy, a ta wiadomość nie mogła zostać przekonwertowana, więc anulowano proces wysyłania dalej`)
                .then(async (x) => {
                    await wait(10000)
                    if (x.deletable) x.delete()
                })
            return
        } else if (mustInform) {
            message.channel.send(`${customEmoticons.info} ${message.author}, posiadasz mniej niż 25 karmy - multimedia nie mogły zostać wysłane z tego powodu`).then(async (x) => {
                await wait(10000)
                if (x.deletable) x.delete()
            })
        } else if (gcapprovedAttachments.size != message.attachments.size) {
            message.channel
                .send(`${customEmoticons.info} ${message.author}, nie wszystkie media mogły zostać wysłane, gdyż GlobalChat przyjmuje tylko niektóre typy plików`)
                .then(async (x) => {
                    await wait(7500)
                    if (x.deletable) x.delete()
                })
        }
        mustInform = null

        const bw = checkAnyBadWords(deleteComments(message.content))
        if (bw.checked) {
            if (message.deletable) message.delete()
            try {
                const embed = new EmbedBuilder()
                    .setAuthor({ name: "Blokada słowa" })
                    .setFields({ name: "Powód", value: `Niedozwolone słowo`, inline: true }, { name: "Kara", value: "3 minuty osobistego cooldownu", inline: true })
                    .setFooter({ text: "Globally, powered by mysterY" })
                    .setColor("Red")
                message.channel.send({ embeds: [embed] })
            } catch (e) {}
            userData.timestampToSendMessage = Date.now() + 180_000
            userData.messageID_bbc = ""
            await db.aset(`userData/${message.author.id}/gc`, gcdata.decode(userData))
            return
        }

        listenerLog(3, "➿ Spełniono warunek (5/5)")

        listenerLog(4, `✅ Ma możliwość wysłania wiadomości do GC`)
        listenerLog(5, `Informacje o wiadomości: `)
        listenerLog(5, `📌 ${GClocation}/${message.id}`)
        if (message.reference !== null)
            listenerLog(5, `➡️ Zawiera odpowiedź na wiadomość (${message.reference.guildId}/${message.reference.channelId}/${message.reference.messageId})`)

        //console.log(database)

        listenerLog(4, `📌 Stacja "${station}"`)

        listenerLog(4, `Różnica cooldownów: ${userData.timestampToSendMessage - Date.now()}`)

        listenerLog(3, "")
        listenerLog(3, "♻️ Wykonywanie działania webhooków")

        /**
         * @type {{ wh: WebhookClient, gid: string, cid: string }[]}
         */
        var webhooks = (
            await Promise.all(
                database
                    .map((x) => x.serverID)
                    .map(async function (guildID) {
                        /**
                         * @type {WebhookClient}
                         */
                        var webhook

                        listenerLog(4, `➡️ Dla serwera o ID ${guildID}`)

                        if (!guildID) {
                            return
                        }

                        var sData = getDataByServerID(guildID)

                        //sprawdzanie, czy wgl istnieje serwer i kanał
                        try {
                            const guild_DClient = await client.guilds.fetch({ guild: guildID, cache: false })
                            const channel_DClient = await guild_DClient.channels.fetch(sData.channel, { cache: false })
                            if (channel_DClient) {
                                if (channel_DClient.type === ChannelType.GuildText) {
                                    const dinfo = new Date()
                                    if (sData.webhook != "none") {
                                        try {
                                            var HTTPRes = await request("https://discord.com/api/webhooks/" + sData.webhook)
                                            if (HTTPRes.statusCode >= 200 && HTTPRes.statusCode < 300) {
                                                webhook = new WebhookClient({
                                                    url: "https://discord.com/api/webhooks/" + sData.webhook,
                                                })
                                            } else {
                                                listenerLog(5, "❕ Nie wczytano webhooka, tworzenie nowego...")
                                                webhook = await channel_DClient.createWebhook({
                                                    name: `GlobalChat (${station} | ${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                                    reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                                })

                                                var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                                data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                                await db.aset(`serverData/${guildID}/gc`, gcdataGuild.decode(data))
                                            }
                                        } catch (e) {
                                            listenerLog(5, "❕ Wyłapano błąd, ignorowanie i tworzenie nowego...")
                                            webhook = await channel_DClient.createWebhook({
                                                name: `GlobalChat (${station} | ${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                                reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                            })

                                            var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                            data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                            await db.aset(`serverData/${guildID}/gc`, gcdataGuild.decode(data))
                                        }

                                        return { wh: webhook, gid: guildID, cid: sData.channel }
                                    } else {
                                        webhook = await channel_DClient.createWebhook({
                                            name: `GlobalChat (${station} | ${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                            reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                        })

                                        var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                        data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                        await db.aset(`serverData/${guildID}/gc`, gcdataGuild.decode(data))

                                        return { wh: webhook, gid: guildID, cid: sData.channel }
                                    }
                                } else {
                                    listenerLog(5, `✖️ Ignorowanie serwera (niepoprawny kanał, oczekiwano: 0, uzyskano: ${channel_DClient.type})`)
                                }
                            } else {
                                guild_DClient.fetchOwner({ cache: false }).then(async (gguildOwner) => {
                                    //embed z informacją o braku kanału
                                    const embedError = new EmbedBuilder()
                                        .setTitle("Nieznaleziony kanał")
                                        .setDescription(
                                            "W trakcie wykonywania usługi GlobalChat, nie udało mi się znaleźć kanału, do którego był ono przypisany - dzieje się tak, gdy kanał został usunięty. Usunięto przed chwilą z bazy danych informacje dla tego serwera i należy jeszcze raz ustawić pod komendą `globalchat kanał ustaw` wszystie kanały, które były podpięte."
                                        )
                                        .addFields({
                                            name: "`Q:` Kanał przypisany do GlobalChata dalej istnieje, nie został on usunięty.",
                                            value: "`A:` Pobierając kanał, nie zwróciło po prostu poprawnej wartości, a dane usunięto. Należy spróbować ustawić kanały ponownie, jeżeli trzy próby zakończą się niepowodzeniem, należy **natychmiast zgłosić to do [serwera support](https://discord.gg/536TSYqT)**",
                                        })
                                        .setFooter({
                                            text: "Globally, powered by mysterY",
                                        })
                                        .setColor("Orange")

                                    gguildOwner.send({
                                        content: `${customEmoticons.info} Tu bot Globally. Jako, że jesteś właścicielem serwera *${guild_DClient.name}*, jest bardzo ważna informacja dla Ciebie!`,
                                        embeds: [embedError],
                                    })

                                    await db.adelete(`serverData/${guildID}/gc`)
                                    return
                                })
                            }
                        } catch (err) {
                            if (err instanceof DiscordAPIError && err.code === 30007) {
                                ;(await client.guilds.fetch({ guild: guildID, cache: false })).fetchOwner().then(async (gguildOwner) => {
                                    //embed z informacją o braku kanału
                                    const embedError = new EmbedBuilder()
                                        .setTitle("Za duża ilość Webhooków")
                                        .setDescription(
                                            "W trakcie wykonywania usługi GlobalChat, API Discorda zwrócił błąd o przekroczeniu liczby Webhooków. Musiałem usunąć całą ową konfigurację z bazy danych. Zwolnij miejsce i ustaw ponownie wszystkie kanały (`globalchat kanał ustaw`)"
                                        )
                                        .addFields({
                                            name: "`Q:` Jak mam usunąć webhooki?",
                                            value: '`A:` Wejdź w ustawienia serwera, w zakładkę "Integracje" (W angielskim "Integrations"). Wybierz bota Globally, zjedź na sam dół i usuń wcześniej utworzone Webhooki.',
                                        })
                                        .setFooter({
                                            text: "Globally, powered by mysterY",
                                        })
                                        .setColor("Orange")

                                    gguildOwner.send({
                                        content: `${customEmoticons.info} Tu bot Globally. Jako, że jesteś właścicielem serwera *${guild_DClient.name}*, jest bardzo ważna informacja dla Ciebie!`,
                                        embeds: [embedError],
                                    })
                                    await db.adelete(`serverData/${guildID}/gc`)
                                })
                            } else {
                                console.warn(err)
                                await db.adelete(`serverData/${guildID}`)
                            }
                            return
                        }
                    })
            )
        ).filter((x) => x)
        //dla używania GlobalActions przez komentowanie
        var withoutReply = deleteComments(message.content).toLowerCase()

        var prefixes = fs.readdirSync("./src/globalactions/").map((x) => x.replace(".js", ""))
        if (serverdata.gc[station].flag_useGA)
            for (var i = 0; i < prefixes.length; i++) {
                var quickdata = (await import(`./globalactions/${prefixes[i]}.js`)).default.data

                if (
                    (withoutReply.startsWith(`${prefixes[i]},`) && quickdata.prompt_type == "chat") ||
                    ((withoutReply.includes(`[${prefixes[i]}]`) || message.mentions.repliedUser?.displayName.startsWith(quickdata.name)) && quickdata.prompt_type == "chat2.0") ||
                    (withoutReply.startsWith(`${prefixes[i]}!`) && quickdata.prompt_type == "cmd")
                ) {
                    prefixes = prefixes[i]
                    break
                }
            }

        function gct() {
            let gctI = [
                true,
                userData.karma >= 25n,
                userData.modPerms > 0 || (userData.karma >= 25n && userHasPremium),
                userData.karma >= 1000n,
                userData.karma >= 1000n && (userData.modPerms === 1 || userData.modPerms === 2 || userHasPremium),
                userData.karma >= 1000n && (userData.modPerms === 3 || userData.modPerms === 4 || ((userData.modPerms === 1 || userData.modPerms === 2) && userHasPremium)),
                userData.karma >= 1000n && (userData.modPerms === 3 || userData.modPerms === 4) && userHasPremium,
                isInMysteryTeam,
            ]

            return gctI.lastIndexOf(true)
        }

        listenerLog(3, "🪪 Dane")
        listenerLog(4, `gct() => ${gct()}`)
        listenerLog(4, `userCooldown(amount<${database.length}>, type<gct()>) => ${userCooldown(database.length, gct())}`)

        userData.timestampToSendMessage =
            Date.now() +
            userCooldown(database.length, gct()) +
            Math.round((typeof prefixes == "string") * Math.pow(userData.gcUses, 1.2137) * (750 - 250 * (userHasPremium || isInMysteryTeam)))
        gct = null
        userData.messageID_bbc = ""
        await db.aset(`userData/${message.author.id}/gc`, gcdata.decode(userData))

        message.content = await formatText(message.content, client)

        const isHisFirstMessage = !lastUser.startsWith(`${GClocation}:${message.author.id}`)
        lastUser = `${GClocation}:${message.author.id}[${isHisFirstMessage}]`
        listenerLog(3, 'ℹ️ Zmienna "lastUser" jest równa "' + lastUser + '"')

        var messages = []
        var editLater = {}

        /**
         * @type {{ text: string, author: { name: string, id: string }, isGA: boolean } | null}
         */
        var replyJSON = null

        Promise.all(
            webhooks.map(async function (w) {
                var reply = await repliedMessage(w.gid ?? "")

                if (reply && w.gid == message.guildId)
                    replyJSON = {
                        text: reply[0].toJSON().description,
                        author: {
                            name: (() => {
                                const wbname = reply[0].toJSON().author.name.replace("W odpowiedzi do ", "")
                                if (wbname.includes("GlobalAction")) return wbname.split("(")[0].trim()
                                else return wbname
                            })(),
                            id: reply[1],
                        },
                        isGA: reply[0].toJSON().author.name.includes("GlobalAction"),
                    }

                // console.log(reply)

                reply = typeof reply === "undefined" ? [] : [reply[0]]

                if (userData.karma == 0n) reply.push(new EmbedBuilder().setDescription("🎉 **Nowy użytkownik!**").setColor("Blue"))

                if (typeof prefixes == "string") {
                    var _file = await import(`./globalactions/${prefixes}.js`)
                    _file = _file.default || _file
                }

                const data = getDataByServerID(w.gid)

                function generateBtns() {
                    let btns = []

                    if (w.gid == message.guildId)
                        if (typeof prefixes == "string")
                            btns = [[new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("ga").setDisabled(true).setLabel(`Użyta akcja: ${_file.data.name}`)]]
                        else btns = [[new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`gcdelete\u0000${message.author.id}`).setDisabled(true).setEmoji("🗑️")]]
                    else if (data.flag_showGCButtons && isHisFirstMessage) {
                        btns = [
                            [
                                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcgi\u0000${message.guildId}`).setEmoji(`ℹ️`),
                                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${message.author.id}`).setEmoji(`👤`),
                                new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`gctab\u0000${message.author.id}`).setEmoji("👉"),
                            ],
                        ]
                        if (typeof prefixes == "string")
                            btns.push([new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("ga").setDisabled(true).setLabel(`Użyta akcja: ${_file.data.name}`)])
                    } else btns = [[]]

                    return btns.filter((row) => row.filter((x) => x).length > 0).map((row) => new ActionRowBuilder().addComponents(...row.filter((x) => x)))
                }

                var x = await w.wh.send({
                    avatarURL: message.author.displayAvatarURL({ size: 128, extension: "png" }),
                    username: wbName(userData.modPerms, data),
                    content: w.gid == message.guildId ? message.content : deleteComments(message.content),
                    embeds: reply,
                    files: (w.gid == message.guildId ? message.attachments : gcapprovedAttachments).map((x) => x),
                    allowedMentions: { parse: [] },
                    components: generateBtns(),
                })

                if (w.gid == message.guildId)
                    editLater = {
                        wh: w.wh,
                        message: x.id,
                    }

                if (typeof prefixes !== "string") messages.push(`${w.gid}/${w.cid}/${x.id}`)

                return
            })
        ).then(async () => {
            const channelid = supportServer.gclogs.msg
            const channel = await client.channels.fetch(channelid)
            try {
                message.delete().catch((er) => console.warn(er))
            } catch (e) {
                console.warn(e)
            }

            var measuringTime = {
                ends: false,
                mustPing: false,
                startTimestamp: Date.now(),
                endTimestamp: 0,
                msg: null,
            }

            if (typeof prefixes == "string") {
                let file = await import(`./globalactions/${prefixes}.js`)
                file = file.default || file
                try {
                    setTimeout(() => {
                        if (!measuringTime.ends) {
                            measuringTime.mustPing = true
                            message.channel.send(
                                `<@${message.author.id}>, od 10 sekund akcja nie odpowiada, jako że nie ma limitu czasowego, dostaniesz ping na kanale z odpowiedzią!`
                            )
                        }
                    }, 10_000)
                    /**
                     * @type {WebhookMessageCreateOptions}
                     */
                    var response = await file.execute(deleteComments(message.content), message.author, replyJSON, client)
                    response.avatarURL ??= file.data.avatar
                    if (response.username !== file.data.username && response.username.length > 0 && response.username.length <= 36) response.username += ` aka ${file.data.name}`
                    else response.username = file.data.name
                    response.username += " (GlobalAction)"
                    response.allowedMentions = { parse: [] }

                    measuringTime.ends = true

                    webhooks.map(async function (w) {
                        var msg = await w.wh.send(response)
                        if (measuringTime.mustPing && w.gid === message.guildId) measuringTime.msg = msg.id
                    })

                    if (measuringTime.mustPing) {
                        var msg = await message.channel.messages.fetch({ message: measuringTime.msg, cache: false })
                        msg.reply(`<@${message.author.id}>`)
                    }

                    if (channel && channel.type === ChannelType.GuildText) {
                        const embed = new EmbedBuilder()
                            .setColor("Blue")
                            .setAuthor({
                                name: message.author.username,
                                iconURL: message.author.displayAvatarURL({ extension: "webp", size: 64 }),
                            })
                            .setDescription(`Wykonanie akcji *${file.data.name}* \`\`\`${deleteComments(message.content)}\`\`\``)
                            .setFooter({ text: `${response.username} | ${station}`, iconURL: response.avatarURL })
                        channel.send({
                            embeds: [embed],
                        })
                    }
                } catch (err) {
                    measuringTime.ends = true
                    if (channel && channel.type === ChannelType.GuildText) {
                        const embeds = [
                            new EmbedBuilder()
                                .setColor("DarkRed")
                                .setAuthor({
                                    name: message.author.username,
                                    iconURL: message.author.displayAvatarURL({ extension: "webp", size: 64 }),
                                })
                                .setDescription(`Niepowodzenie wykonania akcji *${file.data.name}* \`\`\`${deleteComments(message.content)}\`\`\``)
                                .setFields({ name: `Błąd (typ: ${err.name})`, value: `\`\`\`${err.message}\`\`\`` })
                                .setFooter({ text: `${station}` }),
                            new EmbedBuilder().setTitle("*Stacktrace*").setDescription(`\`\`\`${err.stack}\`\`\``),
                        ]
                        channel.send({ embeds })
                    }
                    console.error(err)
                    message.channel.send(`Ojoj <@${message.author.id}>, złe wieści - owy GlobalAction nie został wykonany zgodnie z oczekiwaniami...`)
                }
            } else {
                if (channel && channel.type === ChannelType.GuildText) {
                    let embeds = []
                    const embed = new EmbedBuilder()
                        .setColor("Green")
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.displayAvatarURL({ extension: "webp", size: 64 }),
                        })
                        .setDescription(deleteComments(message.content) || "[ brak tekstu ]")
                        .setFields({
                            name: "Stan",
                            value: "Nie usunięto",
                        })
                        .setFooter({ text: station + (stationHasPasswd ? " | Stacja hasłowana" : "") })
                    embeds.push(embed)
                    if (gcapprovedAttachments.size > 0) {
                        const mediaEmbed = new EmbedBuilder().setTitle("Wysłane multimedia").setDescription(gcapprovedAttachments.map((x) => x.url).join("\n"))
                        embeds.push(mediaEmbed)
                    }
                    var msg = await channel.send({
                        embeds,
                        content: messages.join("|"),
                    })
                }
                var row = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcgi\u0000${message.guildId}`).setEmoji(`ℹ️`),
                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${message.author.id}`).setEmoji(`👤`),
                    new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`gcdelete\u0000${message.author.id}\u0000${msg.id}`).setEmoji("🗑️")
                )
                await msg.edit({
                    components: [row],
                })

                listenerLog(3, "Próba zmiany przycisku webhooka")

                for (let i = 0; i < 5; i++) {
                    listenerLog(4, "Próba nr. " + (i + 1))
                    try {
                        editLater.wh.editMessage(editLater.message, {
                            avatarURL: message.author.displayAvatarURL({ size: 128, extension: "png" }),
                            components: [new ActionRowBuilder().addComponents(new ButtonBuilder(row.toJSON().components.at(-1)))],
                        })
                        listenerLog(5, "✅ Pomyślnie zmieniono przycisk")
                        break
                    } catch (e) {
                        if (i == 4) {
                            console.error(e)
                        }
                    }
                }

                listenerLog(3, `🌐 Zapisano informację o wiadomości użytkownika`)
            }

            if (typeof prefixes == "string") {
                userData.karma += 10n + BigInt((userHasPremium || isInMysteryTeam) * 2)
                userData.gcUses++
            } else if (gcapprovedAttachments.size > 0) userData.karma += BigInt(Math.round(gcapprovedAttachments.size / (2 - userHasPremium * 0.5)) + 2 + userHasPremium)
            else userData.karma += 1n
            if (message.reference && Math.random() < 0.05 * (1 + isInMysteryTeam)) userData.karma += 2n - BigInt(userHasPremium)
            await db.aset(`userData/${message.author.id}/gc`, gcdata.decode(userData))
        })
    } catch (err) {
        message.channel.send(`${customEmoticons.denided} Podczas analizy wystąpił błąd!`)
        if (debug) return console.error(err)
    }
}

export const lastUserHandler = {
    get: () => lastUser,
    reset: () => {
        lastUser = "unknown"
    },
}
