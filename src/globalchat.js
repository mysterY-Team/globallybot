const {
    Client,
    Message,
    EmbedBuilder,
    WebhookClient,
    WebhookMessageCreateOptions,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    DiscordAPIError,
} = require("discord.js")
const { db, customEmoticons, ownersID, debug, supportServer, _bot } = require("./config")
const fs = require("fs")
const { emoticons } = require("./interactions/cmds/globalchat/emotki")
const { listenerLog, wait } = require("./functions/useful")
const { freemem, totalmem } = require("os")
const { gcdata, gcdataGuild } = require("./functions/dbs")
const { request } = require("undici")
const { checkAnyBadWords } = require("./functions/badwords")

const timestampCooldown = new Date()
const globalCooldown = (amount) => 500 + amount * 100
const userCooldown = (amount, type = 0) =>
    [4500 + amount * 360, 4000 + amount * 280, 3750 + amount * 245, 3500 + amount * 230, 3500 + amount * 210, 3500 + amount * 190, 3300 + amount * 180, 3150 + amount * 155][type]
let lastUser = "unknown"

/**
 *
 * @param {string} text
 */
function sprawdzNiedozwoloneLinki(text) {
    /**
     * @type {(RegExp | string)[]}
     */
    const linkList = [
        // blokada linków zaproszeniowych
        /(?:http[s]?:\/\/)?(?:www.|ptb.|canary.)?(?:discord(?:app)?.(?:(?:com|gg)\/(?:invite|servers)\/[a-z0-9-_]+)|discord.gg\/[a-z0-9-_]+)|(?:http[s]?:\/\/)?(?:www.)?(?:dsc.gg|invite.gg+|discord.link|(?:discord.(gg|io|me|li|id))|disboard.org)\/[a-z0-9-_\/]+/gim,

        // blokada linków do stron dla dorosłych
        "pornhub.com",
        "xvideos.com",
        "xhamster.com",
        "xnxx.com",
        "youporn.com",
        "redtube.com",
        "porn.com",
        "hentaihaven.xxx",
        "ichatonline.com",
        "toppornsites.com",
        "tube8.com",
        "ixxx.com",
        "sunporno.com",
        "pornhat.com",
        "sunporno.com",
        "mypornbible.com",
        "badjojo.com",
        "nutaku.net",
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
    text = text.replace(/{(?:emote|e):([^`\n}\s]+)}/g, (match, arg1) => {
        var info = {}
        emoticons.forEach((emoteInfo) => {
            emoteInfo.savenames.forEach((name) => {
                info[name] = emoteInfo.emote
            })
        })

        return info[arg1] ?? customEmoticons.minus
    })
    text = text.replace(/{(?:textFormat|txf)\.mix:([^`\n}]+)}/g, (match, arg1) => {
        var text = ""
        for (let i = 0; i < arg1.length; i++) {
            if (i % 2) text += arg1[i].toUpperCase()
            else text += arg1[i].toLowerCase()
        }
        return text
    })
    text = text.replace(/{(?:textFormat|txf)\.(doubleline|gothic):([^`\n}]+)}/g, (match, arg1, arg2) => {
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
        }

        let rtext = ""

        for (let i = 0; i < arg2.length; i++) rtext += formatLetters[arg1][arg2[i]] ?? arg2[i]

        return rtext
    })

    let matches = text.match(/{(?:serverEmote|se)\.([0-9]{17,19}):([a-zA-Z0-9_]+)}/g)
    if (matches) {
        for (let match of matches) {
            let [$, arg1, arg2] = /{(?:serverEmote|se)\.([0-9]{17,19}):([a-zA-Z0-9_]+)}/.exec(match)
            try {
                const emojis = await (await client.guilds.fetch(arg1)).emojis.fetch()
                if (emojis.map((x) => x.name).includes(arg2)) {
                    const emoji = emojis.map((x) => x)[emojis.map((x) => x.name).indexOf(arg2)]
                    text = text.replace(match, `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`)
                } else {
                    text = text.replace(match, customEmoticons.minus)
                }
            } catch (e) {
                text = text.replace(match, customEmoticons.minus)
            }
        }
    }

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
async function globalchatFunction(client, message) {
    try {
        const GClocation = `${message.guildId}/${message.channelId}`
        var accDate = new Date()
        accDate = `${accDate.getFullYear()}-${accDate.getMonth() + 1}-${accDate.getDate()}`
        var gcapprovedAttachments = message.attachments.filter(
            (x) => x.contentType && (x.contentType.startsWith("image") || x.contentType.startsWith("video") || x.contentType.startsWith("audio"))
        )
        const userHasPremium = (db.get(`userData/${message.author.id}/premium`).val ?? 0) > 0

        function wbName(modPerm) {
            if (modPerm === 2) var rank = "naczelnik"
            else if (modPerm === 1) var rank = "moderator"
            else var rank = "osoba"

            if (userHasPremium) rank += " premium"
            if (ownersID.includes(message.author.id)) rank = "twórca"

            return `${message.author.username} (${rank}; ${message.author.id}; ${message.guildId})`
        }

        /**
         * @returns {Promise<[EmbedBuilder, string] | undefined>}
         */
        async function repliedMessage(gID) {
            if (gID && message.reference) {
                try {
                    var replayedMSG = await message.fetchReference()
                    var rContent = replayedMSG.content,
                        rAttachments

                    if (!replayedMSG.author.bot) {
                        return
                    }

                    //działanie komentarzy w odpowiadanej wiadomości
                    rContent = deleteComments(rContent)

                    // const ruid = !replayedMSG.author.username.includes("GlobalAction)") ? replayedMSG.components?.[0].component?.[2].customId.split("\u0000")[1] : "GlobalAction"
                    const ruid = "[ no active ]"
                    var rUser = replayedMSG.author.username.includes("GlobalAction)") ? replayedMSG.author.username : replayedMSG.author.username.split(" (")[0]

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

        const oldUserSnapshot = db.get(`userData/${message.author.id}/gc`)
        var userData = gcdata.encode(oldUserSnapshot.val)

        if (userData.karma < 25n && !userHasPremium) gcapprovedAttachments = gcapprovedAttachments.filter(() => false)

        if (!deleteComments(message.content) && gcapprovedAttachments.size == 0) return

        if (!message.author.bot && !message.author.system) {
            var snpsht = db.get(`serverData`)
            var database = snpsht.val || {}

            database = Object.entries(database)
                .filter(([n, server]) => "gc" in server)
                .map(([id, data]) => {
                    return { id: id, gc: gcdataGuild.encode(data.gc) }
                })

            //console.log(database)

            var getDataByServerID = (id, classification = "serverID") => {
                var x = database.map((x) => x[classification]).includes(id) ? database[database.map((x) => x[classification]).indexOf(id)] : null
                return x
            }

            var serverdata = getDataByServerID(message.guildId, "id")

            if (
                !database
                    .map((x) => Object.values(x.gc))
                    .flat()
                    .map((x) => x.channel)
                    .includes(message.channelId)
            )
                return

            listenerLog(2, "")
            listenerLog(2, "❗ Wyłapano wiadomość do GC!")

            if (freemem() < totalmem() * 0.05 * !debug) {
                message.reply(`${customEmoticons.loading} Pamięć została przekroczona, czekam na wolne miejsce...`)
                listenerLog(3, "")
                return
            }

            listenerLog(3, "➿ Spełniono warunek (1/5)")

            var station = Object.values(serverdata.gc)
                .map((x) => x.channel)
                .indexOf(message.channelId)
            station = Object.keys(serverdata.gc)[station]

            if (!db.get(`stations/${station}`).exists) {
                let msg = await message.channel.send("Ta stacja przestała istnieć! Usuwanie kanału z bazy danych...")
                let removeData = async function () {
                    delete serverdata.gc[station]
                    if (Object.keys(serverdata.gc).length > 0) db.set(`serverData/${serverdata.id}/gc`, gcdataGuild.decode(serverdata.gc))
                    else db.delete(`serverData/${serverdata.id}/gc`)
                    msg.edit(`~~Ta stacja przestała istnieć! Usuwanie kanału z bazy danych...~~\n${customEmoticons.approved} Usunięto kanał z bazy danych!`)

                    const emb = new EmbedBuilder()
                        .setTitle("Usunięto kanał!")
                        .setDescription(`ID: \`${message.channel.id}\`\nNazwa kanału: \`${message.channel.name}\`\nStacja: \`${station}\`\nOsoba odłączająca: <@${_bot.id}>)`)
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
                                if (res.statusCode >= 200 && res.statusCode < 300) webhook.delete("użycia komendy /GLOBALCHAT")
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

            listenerLog(3, "➿ Spełniono warunek (2/5)")

            if (userData.timestampToSendMessage - 300 > Date.now()) {
                message.reply(`${customEmoticons.denided} Osobisty cooldown! Zaczekaj jeszcze \`${userData.timestampToSendMessage - Date.now()}\` ms`).then(async (msg) => {
                    await wait(Math.max(userData.timestampToSendMessage - Date.now(), 2000))
                    msg.delete()
                })
                if (message.content.toLowerCase() !== "<p>") {
                    userData.messageID_bbc = message.id
                    db.set(`userData/${message.author.id}/gc`, gcdata.decode(userData))
                }
                return
            }

            await wait(Math.max(userData.timestampToSendMessage - Date.now(), 0))

            if (timestampCooldown.getTime() + globalCooldown(database.length) > Date.now()) {
                message.reply(
                    `${customEmoticons.denided} Globalny cooldown! Zaczekaj jeszcze \`${globalCooldown(database.length) - (Date.now() - timestampCooldown.getTime())}\` ms`
                )
                if (message.content.toLowerCase() !== "<p>") {
                    userData.messageID_bbc = message.id
                    db.set(`userData/${message.author.id}/gc`, gcdata.decode(userData))
                }
                return
            }

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
                    const msg = await message.channel.messages.fetch(userData.messageID_bbc)

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

            if (sprawdzNiedozwoloneLinki(deleteComments(message.content)) && !ownersID.includes(message.author.id)) {
                message.react(customEmoticons.denided)
                try {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: "Blokada linku" })
                        .setFields({ name: "Powód", value: "Niedozwolony link", inline: true }, { name: "Kara", value: "3 minuty osobistego cooldownu", inline: true })
                        .setFooter({ text: "Globally, powered by mysterY Team" })
                        .setColor("Red")
                    message.author.send({ embeds: [embed] })
                } catch (e) {}
                userData.timestampToSendMessage = Math.max(Date.now(), userData.timestampToSendMessage) + 180_000
                userData.messageID_bbc = ""
                db.set(`userData/${message.author.id}/gc`, gcdata.decode(userData))
                return
            }

            if (userData.karma < 25n) {
                let varcheckURL = message.content.split("")
                varcheckURL = varcheckURL.filter((x) => x.match(/^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?$/))
                if (varcheckURL.length > 0) {
                    message.react(customEmoticons.denided)
                    try {
                        const embed = new EmbedBuilder()
                            .setAuthor({ name: "Blokada linku" })
                            .setFields({ name: "Powód", value: "Za mała ilość karmy", inline: true }, { name: "Kara", value: "30 sekund osobistego cooldownu", inline: true })
                            .setFooter({ text: "Globally, powered by mysterY Team" })
                            .setColor("Red")
                        message.author.send({ embeds: [embed] })
                    } catch (e) {}
                    userData.timestampToSendMessage = Math.max(Date.now(), userData.timestampToSendMessage) + 30_000
                    userData.messageID_bbc = ""
                    db.set(`userData/${message.author.id}/gc`, gcdata.decode(userData))
                    return
                }
            }

            const bw = checkAnyBadWords(deleteComments(message.content))
            if (bw.checked) {
                if (message.deletable) message.delete()
                try {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: "Blokada słowa" })
                        .setFields(
                            { name: "Powód", value: `Niedozwolone słowo \`${bw.badWord}\``, inline: true },
                            { name: "Kara", value: "minuta osobistego cooldownu", inline: true }
                        )
                        .setFooter({ text: "Globally, powered by mysterY Team" })
                        .setColor("Red")
                    message.channel.send({ embeds: [embed] })
                } catch (e) {}
                userData.timestampToSendMessage = Math.max(Date.now(), userData.timestampToSendMessage) + 60_000
                userData.messageID_bbc = ""
                db.set(`userData/${message.author.id}/gc`, gcdata.decode(userData))
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

            listenerLog(3, "")
            listenerLog(3, "♻️ Wykonywanie działania webhooków")

            delete ddata

            function gct() {
                let gctI = [
                    true,
                    userData.karma >= 25n,
                    userData.modPerms > 0 || (userData.karma >= 25n && userHasPremium),
                    userData.karma >= 1000n,
                    userData.karma >= 1000n && (userData.modPerms === 1 || userHasPremium),
                    userData.karma >= 1000n && (userData.modPerms === 2 || (userData.modPerms === 1 && userHasPremium)),
                    userData.karma >= 1000n && userData.modPerms === 2 && userHasPremium,
                    ownersID.includes(message.author.id),
                ]

                return gctI.findLastIndex((x) => x)
            }

            userData.timestampToSendMessage =
                Math.max(Date.now(), userData.timestampToSendMessage) + userCooldown(database.length, gct()) * (1 + typeof prefixes == "string" * !userHasPremium * 0.6)
            delete gct
            userData.messageID_bbc = ""
            db.set(`userData/${message.author.id}/gc`, gcdata.decode(userData))

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
                                const guild_DClient = await client.guilds.fetch(guildID)
                                const channel_DClient = await guild_DClient.channels.fetch(sData.channel)
                                if (channel_DClient) {
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
                                                webhook = await guild_DClient.channels.createWebhook({
                                                    name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                                    channel: sData.channel,
                                                    reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                                })

                                                var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                                data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                                db.set(`serverData/${guildID}/gc`, gcdataGuild.decode(data))
                                            }
                                        } catch (e) {
                                            listenerLog(5, "❕ Wyłapano błąd, ignorowanie i tworzenie nowego...")
                                            webhook = await guild_DClient.channels.createWebhook({
                                                name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                                channel: sData.channel,
                                                reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                            })

                                            var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                            data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                            db.set(`serverData/${guildID}/gc`, gcdataGuild.decode(data))
                                        }

                                        return { wh: webhook, gid: guildID, cid: sData.channel }
                                    } else {
                                        webhook = await guild_DClient.channels.createWebhook({
                                            name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                            channel: sData.channel,
                                            reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                        })

                                        var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                        data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                        db.set(`serverData/${guildID}/gc`, gcdataGuild.decode(data))

                                        return { wh: webhook, gid: guildID, cid: sData.channel }
                                    }
                                } else {
                                    guild_DClient.fetchOwner().then((gguildOwner) => {
                                        //embed z informacją o braku kanału
                                        const embedError = new EmbedBuilder()
                                            .setTitle("Nieznaleziony kanał")
                                            .setDescription(
                                                "W trakcie wykonywania usługi GlobalChat, nie udało mi się znaleźć kanału, do którego był ono przypisany - dzieje się tak, gdy kanał został usunięty. Usunięto przed chwilą z bazy danych informacje dla tego serwera i należy jeszcze raz ustawić pod komendą `globalchat kanał ustaw` wszystie kanały, które były podpięte."
                                            )
                                            .addFields({
                                                name: "`Q:` Kanał przypisany do GlobalChata dalej istnieje, nie został on usunięty.",
                                                value: "`A:` Pobierając kanał, nie zwróciło po prostu poprawnej wartości, a dane usunięto. Należy spróbować ustawić kanały ponownie, jeżeli trzy próby zakończą się niepowodzeniem, należy **natychmiast zgłosić to do twórców** - do właściciela `patyczakus`, czy do [serwera support](https://discord.gg/536TSYqT)",
                                            })
                                            .setFooter({
                                                text: "Globally, powered by mysterY Team",
                                            })
                                            .setColor("Orange")

                                        gguildOwner.send({
                                            content: `${customEmoticons.info} Tu bot Globally. Jako, że jesteś właścicielem serwera *${guild_DClient.name}*, jest bardzo ważna informacja dla Ciebie!`,
                                            embeds: [embedError],
                                        })

                                        db.delete(`serverData/${guildID}/gc`)
                                        return
                                    })
                                }
                            } catch (err) {
                                if (err instanceof DiscordAPIError && err.code === 30007) {
                                    ;(await client.guilds.fetch(guildID)).fetchOwner().then((gguildOwner) => {
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
                                                text: "Globally, powered by mysterY Team",
                                            })
                                            .setColor("Orange")

                                        gguildOwner.send({
                                            content: `${customEmoticons.info} Tu bot Globally. Jako, że jesteś właścicielem serwera *${guild_DClient.name}*, jest bardzo ważna informacja dla Ciebie!`,
                                            embeds: [embedError],
                                        })
                                        db.delete(`serverData/${guildID}/gc`)
                                    })
                                } else {
                                    console.warn(err)
                                    db.delete(`serverData/${guildID}`)
                                }
                                return
                            }
                        })
                )
            ).filter((x) => x)
            //dla używania GlobalActions przez komentowanie
            var withoutReply = deleteComments(message.content).toLowerCase()

            var prefixes = fs.readdirSync("./src/globalactions/").map((x) => x.replace(".js", ""))
            for (var i = 0; i < prefixes.length; i++) {
                var quickdata = require(`./globalactions/${prefixes[i]}`).data

                if (
                    (withoutReply.startsWith(`${prefixes[i]},`) && quickdata.prompt_type == "chat") ||
                    ((withoutReply.includes(`[${prefixes[i]}]`) || message.mentions.repliedUser?.displayName.startsWith(quickdata.name)) && quickdata.prompt_type == "chat2.0") ||
                    (withoutReply.startsWith(`${prefixes[i]}!`) && quickdata.prompt_type == "cmd")
                ) {
                    prefixes = prefixes[i]
                    break
                }
            }

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
                                    if (wbname.endsWith(", GlobalAction)")) return wbname.split(" (")[1].split(",")[0].replace(/"/g, "")
                                    else if (wbname.endsWith("GlobalAction)")) return wbname.split(" (")[0]
                                    else return wbname
                                })(),
                                id: reply[1],
                            },
                            isGA: reply[0].toJSON().author.name.endsWith("GlobalAction)"),
                        }

                    // console.log(reply)

                    reply = typeof reply === "undefined" ? [] : [reply[0]]

                    if (typeof prefixes == "string") var _file = require(`./globalactions/${prefixes}`)
                    var comp = [
                        typeof prefixes == "string"
                            ? [new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("ga").setDisabled(true).setLabel(`Użyta akcja: ${_file.data.name}`)]
                            : [new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`gcdelete\u0000${message.author.id}\u0000??`).setDisabled(true).setEmoji("🗑️")],
                    ]
                        .filter((row) => row.filter((x) => x).length > 0)
                        .map((row) => new ActionRowBuilder().addComponents(...row.filter((x) => x)))

                    var x = await w.wh.send({
                        avatarURL: message.author.avatarURL({ size: 128, extension: "png" }),
                        username: wbName(userData.modPerms),
                        content: w.gid == message.guildId ? message.content : deleteComments(message.content),
                        embeds: reply,
                        files: (w.gid == message.guildId ? message.attachments : gcapprovedAttachments).map((x) => x),
                        allowedMentions: { parse: [] },
                        components: w.gid == message.guildId ? comp : [],
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

                if (message.deletable)
                    try {
                        message.delete()
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
                    const file = require(`./globalactions/${prefixes}`)
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
                        response.username ??= file.data.name
                        response.username += ` (${response.username === file.data.name ? "" : `"${file.data.name}", `}GlobalAction)`
                        response.allowedMentions = { parse: [] }

                        measuringTime.ends = true

                        webhooks.map(async function (w) {
                            var msg = await w.wh.send(response)
                            if (measuringTime.mustPing && w.gid === message.guildId) measuringTime.msg = msg.id
                        })

                        if (measuringTime.mustPing) {
                            var msg = await message.channel.messages.fetch(measuringTime.msg)
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
                            const embed = new EmbedBuilder()
                                .setColor("DarkRed")
                                .setAuthor({
                                    name: message.author.username,
                                    iconURL: message.author.displayAvatarURL({ extension: "webp", size: 64 }),
                                })
                                .setDescription(`Niepowodzenie wykonania akcji *${file.data.name}* \`\`\`${deleteComments(message.content)}\`\`\``)
                                .setFields({ name: "Błąd", value: `\`\`\`${err}\`\`\`` })
                                .setFooter({ text: `${station}` })
                            channel.send({
                                embeds: [embed],
                            })
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
                            .setFooter({ text: `${station}` })
                        embeds.push(embed)
                        if (gcapprovedAttachments.size > 0) {
                            const mediaEmbed = new EmbedBuilder().setTitle("Wysłane multimedia").setDescription(gcapprovedAttachments.map((x) => x.url).join("\n"))
                            embeds.push(mediaEmbed)
                        }
                        var msg = await channel.send({
                            embeds,
                            content: messages.join("|"),
                        })
                        await msg.edit({
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcgi\u0000${message.guildId}`).setEmoji(`ℹ️`),
                                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${message.author.id}`).setEmoji(`👤`),
                                    new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`gcdelete\u0000${message.author.id}\u0000${msg.id}`).setEmoji("🗑️")
                                ),
                            ],
                        })

                        listenerLog(3, "Próba zmiany przycisku webhooka")

                        for (let i = 0; i < 5; i++) {
                            listenerLog(4, "Próba nr. " + (i + 1))
                            try {
                                editLater.wh.editMessage(editLater.message, {
                                    components: [
                                        new ActionRowBuilder().addComponents([
                                            new ButtonBuilder()
                                                .setStyle(ButtonStyle.Danger)
                                                .setCustomId(`gcdelete\u0000${message.author.id}\u0000${msg.id}`)
                                                .setEmoji("🗑️")
                                                .setDisabled(false),
                                        ]),
                                    ],
                                })
                                listenerLog(5, "✅ Pomyślnie zmieniono przycisk")
                                break
                            } catch (e) {}
                        }

                        listenerLog(3, `🌐 Zapisano informację o wiadomości użytkownika`)
                    }
                }

                if (typeof prefixes == "string") userData.karma += 15n + BigInt(userHasPremium * 3)
                else if (gcapprovedAttachments.size > 0) userData.karma += 3n + BigInt(gcapprovedAttachments.size / 2 + 0.5 + userHasPremium)
                else userData.karma += 1n
                if (message.reference && Math.random() < 0.05) userData.karma += 2n - BigInt(userHasPremium)
                db.set(`userData/${message.author.id}/gc`, gcdata.decode(userData))
            })
        }
    } catch (err) {
        if (debug) console.error(err)
    }
}

module.exports = {
    globalchatFunction,
    lastUserHandler: {
        get: () => lastUser,
        reset: () => {
            lastUser = "unknown"
        },
    },
}
