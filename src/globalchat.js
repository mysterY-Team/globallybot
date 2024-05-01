const { Client, Message, EmbedBuilder, WebhookClient, WebhookMessageCreateOptions, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { getDatabase, ref, get, remove, set } = require("@firebase/database")
const { firebaseApp, customEmoticons, ownersID, GCmodsID, _bot, debug } = require("./config")
const axios = require("axios").default
const fs = require("fs")
const { emoticons } = require("./cmds/globalchat/emotki")
const { listenerLog } = require("./functions/useful")

const timestampCooldown = new Date()
const globalCooldown = 1200
const channelCooldown = 3000
const userCooldown = 5000
let cooldownList = {
    channel: [],
    user: [],
}
let lastUser = ""

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
 * @returns {string}
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
    text = text.replace(/{(?:textFormat|txf)\.doubleline:([^`\n}]+)}/g, (match, arg1) => {
        const formatRay = {
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
        }

        let rtext = ""

        for (let i = 0; i < arg1.length; i++) rtext += formatRay[arg1[i]] ?? arg1[i]

        return rtext
    })
    text = text.replace(/{(?:textFormat|txf)\.gothic:([^`\n}]+)}/g, (match, arg1) => {
        const formatRay = {
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
        }

        let rtext = ""

        for (let i = 0; i < arg1.length; i++) rtext += formatRay[arg1[i]] ?? arg1[i]

        return rtext
    })

    let matches = text.match(/{(?:serverEmote|se)\.([0-9]{17,19}):([a-zA-Z0-9_]+)}/g)
    if (matches) {
        for (let match of matches) {
            let [, arg1, arg2] = /{(?:serverEmote|se)\.([0-9]{17,19}):([a-zA-Z0-9_]+)}/.exec(match)
            const emojis = await (await client.guilds.fetch(arg1)).emojis.fetch()
            if (emojis.map((x) => x.name).includes(arg2)) {
                const emoji = emojis.map((x) => x)[emojis.map((x) => x.name).indexOf(arg2)]
                text = text.replace(match, `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`)
            } else {
                text = text.replace(match, customEmoticons.minus)
            }
        }
    }

    return text
}

/**
 * GlobalChat v2
 * @param {Client<true>} DiscordClient
 * @param {Message<true>} DiscordMessage
 * @param {{ text: string, msgID: string, author: { id: string, name: string, isUser: boolean, avatar: string | null }, location: string, files: string[] }} GlobalChatMessage
 */
function globalchatFunction(DiscordClient, DiscordMessage, GlobalChatMessage) {
    try {
        function calculateAge(birthDate, otherDate) {
            birthDate = new Date(birthDate)
            otherDate = new Date(otherDate)
            var years = otherDate.getFullYear() - birthDate.getFullYear()
            if (otherDate.getMonth() < birthDate.getMonth() || (otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate())) {
                years--
            }
            return years
        }
        var accDate = new Date()
        accDate = `${accDate.getFullYear()}-${accDate.getMonth() + 1}-${accDate.getDate()}`

        function wbName(gID) {
            if (ownersID.includes(GlobalChatMessage.author.id)) var rank = "właściciel"
            else if (GCmodsID.includes(GlobalChatMessage.author.id)) var rank = "moderator GC"
            else var rank = "osoba"

            return DiscordMessage.guildId != gID
                ? `${GlobalChatMessage.author.name} (${rank}; ${GlobalChatMessage.author.id})`
                : `${GlobalChatMessage.author.name} (${rank}; ten serwer)`
        }

        GlobalChatMessage.text = GlobalChatMessage.text.split("```")
        for (let i = 0; i < GlobalChatMessage.text.length; i++) {
            GlobalChatMessage.text[i] = {
                text: GlobalChatMessage.text[i],
                isInCode: i % 2 == 0 ? false : true,
            }
        }
        GlobalChatMessage.text = GlobalChatMessage.text.map(function (x) {
            if (!x.isInCode) {
                x.text = x.text
                    .split("\n")
                    .filter((c) => !c.startsWith("<##> "))
                    .join("\n")
            }

            return x
        })
        GlobalChatMessage.text = GlobalChatMessage.text.map((x) => x.text).join("```")

        if (GlobalChatMessage.files.length == 0 && GlobalChatMessage.text == "") return

        /**
         * @returns {EmbedBuilder | undefined}
         */
        function repliedMessage(gID) {
            if (DiscordMessage.reference !== null) {
                var replayedMSG = DiscordMessage.channel.messages.cache.get(DiscordMessage.reference.messageId)
                if (typeof replayedMSG !== "undefined" && replayedMSG.author.bot) {
                    var rContent = replayedMSG.content,
                        rAttachments

                    //działanie komentarzy w odpowiadanej wiadomości
                    rContent = rContent.split("```")
                    for (let i = 0; i < rContent.length; i++) {
                        rContent[i] = {
                            text: rContent[i],
                            isInCode: i % 2 == 0 ? false : true,
                        }
                    }
                    rContent = rContent.map(function (x) {
                        if (!x.isInCode) {
                            x.text = x.text
                                .split("\n")
                                .filter((c) => !c.startsWith("<##> "))
                                .join("\n")
                        }

                        return x
                    })
                    rContent = rContent.map((x) => x.text).join("```")
                    rContent = rContent.trim()

                    var rUser = replayedMSG.author.username.includes("GlobalAction)") ? replayedMSG.author.username : replayedMSG.author.username.split(" (")[0]

                    var embed = { iconURL: replayedMSG.author.avatarURL({ extension: "png" }), name: `W odpowiedzi do ${rUser}` }
                    if (gID == DiscordMessage.guildId) embed.url = replayedMSG.url
                    embed = new EmbedBuilder().setAuthor(embed).setTimestamp(replayedMSG.createdTimestamp)
                    if (rContent) embed = embed.setDescription(rContent)
                    if (gID == DiscordMessage.guildId) embed = embed.setFooter({ text: "Kliknięcie w nagłówek spowoduje przeniesienie do odpowiadanej wiadomości" })
                    if (replayedMSG.attachments.size > 0) {
                        rAttachments = replayedMSG.attachments.map((x) => `[\`${x.name}\`](${x.url})`).join("\n")
                        if (rAttachments.length > 1000) rAttachments = replayedMSG.attachments.map((x) => x.url).join("\n")
                        if (rAttachments.length > 1000) rAttachments = replayedMSG.attachments.map((x) => `\`${x.name}\``).join("\n")
                        if (rAttachments.length > 1000) rAttachments = `[ plików: ${replayedMSG.attachments.size} ]`
                        embed = embed.addFields({ name: "Przesłane pliki", value: rAttachments })
                    }

                    return embed
                }
            }
        }

        //dla używania GlobalActions przez komentowanie
        var withoutReply = GlobalChatMessage.text.toLowerCase()

        var prefixes = fs.readdirSync("./src/globalactions/").map((x) => x.replace(".js", ""))
        for (var i = 0; i < prefixes.length; i++) {
            var resType = require(`./globalactions/${prefixes[i]}`).data.prompt_type

            if (
                (withoutReply.startsWith(`${prefixes[i]},`) && resType == "chat") ||
                (withoutReply.includes(`[${prefixes[i]}]`) && resType == "chat2.0") ||
                (withoutReply.startsWith(`${prefixes[i]}!`) && resType == "cmd")
            ) {
                prefixes = prefixes[i]
                break
            }
        }

        if (GlobalChatMessage.author.isUser) {
            get(ref(getDatabase(firebaseApp), `${_bot.type}/serverData`)).then(async (snpsht) => {
                var database = snpsht.val() || {}

                database = Object.entries(database)
                    .filter(([n, server]) => "gc" in server)
                    .map(([id, data]) => {
                        return { id: id, gc: data.gc }
                    })

                var getDataByServerID = (id, classification = "serverID") => {
                    return database.map((x) => x[classification]).includes(id) ? database[database.map((x) => x[classification]).indexOf(id)] : null
                }

                var serverdata = getDataByServerID(DiscordMessage.guildId, "id")

                if (
                    !database
                        .map((x) => Object.values(x.gc))
                        .flat()
                        .map((x) => x.channel)
                        .includes(DiscordMessage.channelId)
                )
                    return

                listenerLog(3, "➿ Spełniono warunek (1/6)")

                {
                    const idCheck = cooldownList.user.map((x) => x.id).findIndex((x) => x === GlobalChatMessage.author.id)
                    if (idCheck > -1) {
                        DiscordMessage.reply(
                            `${customEmoticons.denided} Osobisty cooldown! Zaczekaj jeszcze \`${userCooldown - (Date.now() - cooldownList.user[idCheck].timestamp)}\` ms`
                        )
                        return
                    }
                }

                {
                    const idCheck = cooldownList.channel.map((x) => x.loc).findIndex((x) => x === GlobalChatMessage.location)
                    if (idCheck > -1) {
                        DiscordMessage.reply(
                            `${customEmoticons.denided} Cooldown na kanale! Zaczekaj jeszcze \`${channelCooldown - (Date.now() - cooldownList.channel[idCheck].timestamp)}\` ms`
                        )
                        return
                    }
                }

                if (timestampCooldown.getTime() + globalCooldown > Date.now()) {
                    DiscordMessage.reply(`${customEmoticons.denided} Globalny cooldown! Zaczekaj jeszcze \`${globalCooldown - (Date.now() - timestampCooldown.getTime())}\` ms`)
                    return
                }

                listenerLog(3, "➿ Spełniono warunek (2/6)")

                var userData = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${GlobalChatMessage.author.id}/gc`))
                if (userData.exists()) userData = userData.val()
                else {
                    DiscordMessage.reply(
                        `${customEmoticons.info} Nie został zarejestrowany profil GlobalChat! Utwórz pod komendą \`profil utwórz typ:GlobalChat\`, aby móc z niego korzystać!`
                    ).then((msg) => {
                        setTimeout(() => {
                            if (msg.deletable) msg.delete()
                        }, 10000)
                    })
                    DiscordMessage.react(customEmoticons.minus)
                    return
                }

                listenerLog(3, "➿ Spełniono warunek (3/6)")

                if (userData.block.is) {
                    DiscordMessage.react(customEmoticons.denided)
                    return
                }

                listenerLog(3, "➿ Spełniono warunek (4/6)")

                if (sprawdzNiedozwoloneLinki(GlobalChatMessage.text) && !ownersID.includes(GlobalChatMessage.author.id)) {
                    DiscordMessage.react(customEmoticons.denided)
                    return
                }

                listenerLog(3, "➿ Spełniono warunek (5/6)")
                listenerLog(4, `✅ Ma możliwość wysłania wiadomości do GC`)
                listenerLog(5, `Informacje o wiadomości: `)
                listenerLog(5, `📌 ${GlobalChatMessage.location}/${DiscordMessage.id}`)
                if (DiscordMessage.reference !== null)
                    listenerLog(
                        5,
                        `➡️ Zawiera odpowiedź na wiadomość (${DiscordMessage.reference.guildId}/${DiscordMessage.reference.channelId}/${DiscordMessage.reference.messageId})`
                    )

                var station = Object.values(serverdata.gc)
                    .map((x) => x.channel)
                    .indexOf(DiscordMessage.channelId)
                station = Object.keys(serverdata.gc)[station]
                database = database.filter((x) => Object.keys(x.gc).includes(station)).map((x) => Object.assign(x.gc[station], { serverID: x.id }))

                listenerLog(4, `📌 Stacja "${station}"`)

                if (
                    station === "pl-a" &&
                    calculateAge(userData.birth, accDate) < 18 - 2 * GCmodsID.includes(DiscordMessage.author.id) &&
                    !ownersID.includes(DiscordMessage.author.id)
                ) {
                    DiscordMessage.react(customEmoticons.denided)
                    return
                }

                listenerLog(3, "➿ Spełniono warunek (6/6)")
                listenerLog(3, "")
                listenerLog(3, "♻️ Wykonywanie sprawdzania webhooków")
                timestampCooldown.setTime(new Date().getTime())
                var webhooks = await Promise.all(
                    database
                        .map((x) => x.serverID)
                        .map(async function (guildID) {
                            /**
                             * @type {WebhookClient}
                             */
                            var webhook

                            listenerLog(4, `➡️ Dla serwera o ID ${guildID}`)

                            //sprawdzanie, czy wgl istnieje serwer i kanał
                            const guild_DClient = DiscordClient.guilds.cache.get(guildID)
                            if (typeof guild_DClient != "undefined") {
                                //console.log(await guild_DClient.fetchOwner())
                                const channel_DClient = guild_DClient.channels.cache.get(getDataByServerID(guildID).channel)
                                if (typeof channel_DClient != "undefined") {
                                    const dinfo = new Date()
                                    if (getDataByServerID(guildID).webhook != "none") {
                                        try {
                                            var HTTPRes = await axios.get("https://discord.com/api/webhooks/" + getDataByServerID(guildID).webhook)
                                            if (!("code" in HTTPRes.data)) {
                                                webhook = new WebhookClient({
                                                    url: "https://discord.com/api/webhooks/" + getDataByServerID(guildID).webhook,
                                                })
                                            } else {
                                                listenerLog(5, "❕ Nie wczytano webhooka, tworzenie nowego...")
                                                webhook = await guild_DClient.channels.createWebhook({
                                                    name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                                    channel: getDataByServerID(guildID).channel,
                                                    reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                                })
                                                set(
                                                    ref(getDatabase(firebaseApp), `${_bot.type}/serverData/${guildID}/gc/${station}/webhook`),
                                                    webhook.url.replace("https://discord.com/api/webhooks/", "")
                                                )
                                            }
                                        } catch (e) {
                                            listenerLog(5, "❕ Wyłapano błąd, ignorowanie i tworzenie nowego...")
                                            webhook = await guild_DClient.channels.createWebhook({
                                                name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                                channel: getDataByServerID(guildID).channel,
                                                reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                            })
                                            set(
                                                ref(getDatabase(firebaseApp), `${_bot.type}/serverData/${guildID}/gc/${station}/webhook`),
                                                webhook.url.replace("https://discord.com/api/webhooks/", "")
                                            )
                                        }

                                        return { wh: webhook, gid: guildID }
                                    } else {
                                        webhook = await guild_DClient.channels.createWebhook({
                                            name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                            channel: getDataByServerID(guildID).channel,
                                            reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                        })
                                        set(
                                            ref(getDatabase(firebaseApp), `${_bot.type}/serverData/${guildID}/gc/${station}/webhook`),
                                            webhook.url.replace("https://discord.com/api/webhooks/", "")
                                        )

                                        return { wh: webhook, gid: guildID }
                                    }
                                } else {
                                    guild_DClient.fetchOwner().then((gguildOwner) => {
                                        //embed z informacją o braku kanału
                                        const embedError = new EmbedBuilder()
                                            .setTitle("Nieznaleziony kanał")
                                            .setDescription(
                                                "W trakcie wykonywania usługi GlobalChat, nie udało mi się znaleźć kanału, do którego był ono przypisany - dzieje się tak, gdy kanał został usunięty. Usunięto przed chwilą z bazy danych informacje dla tego serwera i należy jeszcze raz ustawić kanał pod komendą `globalchat kanał ustaw`."
                                            )
                                            .addFields({
                                                name: "`Q:` Kanał przypisany do GlobalChata dalej istnieje, nie został on usunięty.",
                                                value: "`A:` Pobierając kanał, nie zwróciło po prostu poprawnej wartości, a dane usunięto. Należy spróbować ustawić kanał, jeżeli trzy próby zakończą się niepowodzeniem, należy **natychmiast zgłosić to do twórców** - do właściciela `patyczakus`, czy do [serwera support](https://discord.gg/536TSYqT)",
                                            })
                                            .setFooter({
                                                text: "Globally, powered by patYczakus",
                                            })
                                            .setColor("Orange")

                                        gguildOwner.send({
                                            content: `${customEmoticons.info} Tu bot Globally. Jako, że jesteś właścicielem serwera *${guild_DClient.name}*, jest bardzo ważna informacja dla Ciebie!`,
                                            embeds: [embedError],
                                        })

                                        remove(ref(getDatabase(firebaseApp), `${_bot.type}/serverData/${guildID}/gc/${station}`))
                                        return
                                    })
                                }
                            } else {
                                remove(ref(getDatabase(firebaseApp), `${_bot.type}/serverData/${guildID}/gc/${station}`))
                                return
                            }
                        })
                        .filter((x) => typeof x != "undefined")
                )

                GlobalChatMessage.text = await formatText(GlobalChatMessage.text, DiscordClient)
                DiscordMessage.content = await formatText(DiscordMessage.content, DiscordClient)

                Promise.all(
                    webhooks.map(async function (w) {
                        var a = repliedMessage(w.gid)
                        a = typeof a === "undefined" ? [] : [a]

                        if (typeof prefixes == "string") var _file = require(`./globalactions/${prefixes}`)
                        var comp = {
                            global: [
                                [
                                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("fs").setDisabled(true).setLabel(`Ze serwera: ${DiscordMessage.guild.name}`),
                                    typeof prefixes == "string"
                                        ? new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("ga").setDisabled(true).setLabel(`Użyta akcja: ${_file.data.name}`)
                                        : null,
                                ],
                                lastUser !== `${GlobalChatMessage.location}:${GlobalChatMessage.author.id}`
                                    ? [new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gctab\u0000${GlobalChatMessage.author.id}`).setEmoji("👉")]
                                    : [],
                            ]
                                .filter((row) => row && row.filter((x) => x).length > 0)
                                .map((row) => new ActionRowBuilder().addComponents(...row.filter((x) => x))),
                            server: [
                                [
                                    typeof prefixes == "string"
                                        ? new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("ga").setDisabled(true).setLabel(`Użyta akcja: ${_file.data.name}`)
                                        : null,
                                ],
                            ]
                                .filter((row) => row.filter((x) => x).length > 0)
                                .map((row) => new ActionRowBuilder().addComponents(...row.filter((x) => x))),
                        }

                        await w.wh.send({
                            avatarURL: GlobalChatMessage.author.avatar,
                            username: wbName(w.gid),
                            content: w.gid == DiscordMessage.guildId ? DiscordMessage.content : GlobalChatMessage.text,
                            embeds: a,
                            files: GlobalChatMessage.files,
                            allowedMentions: { parse: [] },
                            components: w.gid == DiscordMessage.guildId ? comp.server : comp.global,
                        })

                        return
                    })
                ).then(async () => {
                    lastUser = `${GlobalChatMessage.location}:${GlobalChatMessage.author.id}`
                    cooldownList.channel.push({ loc: GlobalChatMessage.location, timestamp: Date.now() })
                    setTimeout(
                        (ind) => {
                            cooldownList.channel = cooldownList.channel.filter((x, i) => x.loc !== ind)
                        },
                        userCooldown,
                        GlobalChatMessage.location
                    )

                    cooldownList.user.push({ id: GlobalChatMessage.author.id, timestamp: Date.now() })
                    setTimeout(
                        (ind) => {
                            cooldownList.user = cooldownList.user.filter((x, i) => x.id !== ind)
                        },
                        userCooldown,
                        GlobalChatMessage.author.id
                    )

                    if (DiscordMessage.deletable) DiscordMessage.delete()

                    if (typeof prefixes == "string") {
                        const file = require(`./globalactions/${prefixes}`)
                        /**
                         * @type {WebhookMessageCreateOptions}
                         */
                        var response = await file.execute(GlobalChatMessage.text, DiscordMessage.author)
                        response.avatarURL ??= file.data.avatar
                        response.username ??= file.data.name
                        response.username += ` (${response.username === file.data.name ? "" : `"${file.data.name}", `}GlobalAction)`
                        response.allowedMentions = { parse: [] }

                        webhooks.map(async function (w) {
                            await w.wh.send(Object.assign(response))

                            return
                        })
                    }
                })
            })
        }
    } catch (err) {
        DiscordMessage.reply(`${customEmoticons.denided} Nie mogłem przetworzyć Twojego rządania! Bardzo możliwe że to po, rozważ napisanie o tym błędzie do serwera support`).then(
            () => {
                if (debug) {
                    class GlobalChatError extends Error {}

                    console.error(new GlobalChatError(err))
                }
            }
        )
    }
}

module.exports = {
    globalchatFunction,
}
