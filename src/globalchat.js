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
const { db, customEmoticons, ownersID, GCmodsID, debug } = require("./config")
const axios = require("axios").default
const fs = require("fs")
const { emoticons } = require("./cmds/globalchat/emotki")
const { listenerLog } = require("./functions/useful")
const { freemem, totalmem } = require("os")
const { gcdata, gcdataGuild } = require("./functions/dbs")

const timestampCooldown = new Date()
const globalCooldown = 1000
const channelCooldown = (amount) => 2000 + amount * 200
const userCooldown = (amount) => 3000 + amount * 300
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
async function globalchatFunction(DiscordClient, DiscordMessage, GlobalChatMessage) {
    try {
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
         * @returns {Promise<EmbedBuilder | undefined>}
         */
        async function repliedMessage(gID) {
            if (DiscordMessage.reference !== null) {
                try {
                    var replayedMSG = await DiscordMessage.channel.messages.fetch(DiscordMessage.reference.messageId)
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
                } catch (e) {}
            }
        }

        //dla używania GlobalActions przez komentowanie
        var withoutReply = GlobalChatMessage.text.toLowerCase()

        var prefixes = fs.readdirSync("./src/globalactions/").map((x) => x.replace(".js", ""))
        for (var i = 0; i < prefixes.length; i++) {
            var quickdata = require(`./globalactions/${prefixes[i]}`).data

            if (
                (withoutReply.startsWith(`${prefixes[i]},`) && quickdata.prompt_type == "chat") ||
                ((withoutReply.includes(`[${prefixes[i]}]`) || DiscordMessage.mentions.repliedUser?.displayName.startsWith(quickdata.name)) &&
                    quickdata.prompt_type == "chat2.0") ||
                (withoutReply.startsWith(`${prefixes[i]}!`) && quickdata.prompt_type == "cmd")
            ) {
                prefixes = prefixes[i]
                break
            }
        }

        if (GlobalChatMessage.author.isUser) {
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

            var serverdata = getDataByServerID(DiscordMessage.guildId, "id")

            if (
                !database
                    .map((x) => Object.values(x.gc))
                    .flat()
                    .map((x) => x.channel)
                    .includes(DiscordMessage.channelId)
            )
                return

            listenerLog(3, "➿ Spełniono warunek (1/5)")

            if (freemem() < totalmem() * 0.05 * !debug) {
                DiscordMessage.reply(`${customEmoticons.loading} Pamięć została przekroczona, czekam na wolne miejsce...`)
                listenerLog(3, "")
                return
            }

            var station = Object.values(serverdata.gc)
                .map((x) => x.channel)
                .indexOf(DiscordMessage.channelId)
            station = Object.keys(serverdata.gc)[station]

            var userSnpsht = db.get(`userData/${GlobalChatMessage.author.id}/gc`)

            if (userSnpsht.exists) {
                const oldUData = userSnpsht.val
                var userData = gcdata.encode(oldUData)
            } else {
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

            listenerLog(3, "➿ Spełniono warunek (2/5)")

            if (userData.timestampToSendMessage > Date.now()) {
                DiscordMessage.reply(`${customEmoticons.denided} Osobisty cooldown! Zaczekaj jeszcze \`${userData.timestampToSendMessage - Date.now()}\` ms`)
                return
            }

            var ddata = gcdataGuild.encode(snpsht.val[DiscordMessage.guildId].gc)
            // console.log(ddata, station)
            if (ddata[station].timestamp > Date.now()) {
                DiscordMessage.reply(`${customEmoticons.denided} Cooldown na kanale! Zaczekaj jeszcze \`${ddata[station].timestamp - Date.now()}\` ms`)
                return
            }

            if (timestampCooldown.getTime() + globalCooldown > Date.now()) {
                DiscordMessage.reply(`${customEmoticons.denided} Globalny cooldown! Zaczekaj jeszcze \`${globalCooldown - (Date.now() - timestampCooldown.getTime())}\` ms`)
                return
            }

            database = database.filter((x) => Object.keys(x.gc).includes(station)).map((x) => Object.assign(x.gc[station], { serverID: x.id }))

            listenerLog(3, "➿ Spełniono warunek (3/5)")
            userData.timestampToSendMessage = Date.now() + userCooldown(database.length)
            db.set(`userData/${GlobalChatMessage.author.id}/gc`, gcdata.decode(userData))
            ddata[station].timestamp = Date.now() + channelCooldown(database.length)
            db.set(`serverData/${DiscordMessage.guildId}/gc`, gcdataGuild.decode(ddata))
            delete ddata

            if (userData.isBlocked) {
                DiscordMessage.react(customEmoticons.denided)
                return
            }

            listenerLog(3, "➿ Spełniono warunek (4/5)")

            if (sprawdzNiedozwoloneLinki(GlobalChatMessage.text) && !ownersID.includes(GlobalChatMessage.author.id)) {
                DiscordMessage.react(customEmoticons.denided)
                return
            }

            listenerLog(3, "➿ Spełniono warunek (5/5)")
            listenerLog(4, `✅ Ma możliwość wysłania wiadomości do GC`)
            listenerLog(5, `Informacje o wiadomości: `)
            listenerLog(5, `📌 ${GlobalChatMessage.location}/${DiscordMessage.id}`)
            if (DiscordMessage.reference !== null)
                listenerLog(
                    5,
                    `➡️ Zawiera odpowiedź na wiadomość (${DiscordMessage.reference.guildId}/${DiscordMessage.reference.channelId}/${DiscordMessage.reference.messageId})`
                )

            //console.log(database)

            listenerLog(4, `📌 Stacja "${station}"`)

            listenerLog(3, "")
            listenerLog(3, "♻️ Wykonywanie działania webhooków")
            timestampCooldown.setTime(new Date().getTime())
            /**
             * @type {{ wh: WebhookClient, gid: string, cid: string }[]}
             */
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
                        try {
                            const guild_DClient = await DiscordClient.guilds.fetch(guildID)
                            const channel_DClient = await guild_DClient.channels.fetch(getDataByServerID(guildID).channel)
                            if (channel_DClient) {
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

                                            var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                            data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                            db.set(`serverData/${guildID}/gc`, gcdataGuild.decode(data))
                                        }
                                    } catch (e) {
                                        listenerLog(5, "❕ Wyłapano błąd, ignorowanie i tworzenie nowego...")
                                        webhook = await guild_DClient.channels.createWebhook({
                                            name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                            channel: getDataByServerID(guildID).channel,
                                            reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                        })

                                        var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                        data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                        db.set(`serverData/${guildID}/gc`, gcdataGuild.decode(data))
                                    }

                                    return { wh: webhook, gid: guildID, cid: getDataByServerID(guildID).channel }
                                } else {
                                    webhook = await guild_DClient.channels.createWebhook({
                                        name: `GlobalChat (${dinfo.getFullYear()}-${dinfo.getMonth()}-${dinfo.getDate()} ${dinfo.getHours()}:${dinfo.getMinutes()}:${dinfo.getSeconds()})`,
                                        channel: getDataByServerID(guildID).channel,
                                        reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                    })

                                    var data = gcdataGuild.encode(snpsht.val[guildID].gc)
                                    data[station].webhook = webhook.url.replace("https://discord.com/api/webhooks/", "")
                                    db.set(`serverData/${guildID}/gc`, gcdataGuild.decode(data))

                                    return { wh: webhook, gid: guildID, cid: getDataByServerID(guildID).channel }
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
                                            text: "Globally, powered by patYczakus",
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
                                guild_DClient.fetchOwner().then((gguildOwner) => {
                                    //embed z informacją o braku kanału
                                    const embedError = new EmbedBuilder()
                                        .setTitle("Za duża ilość Webhooków")
                                        .setDescription(
                                            "W trakcie wykonywania usługi GlobalChat, API Discorda zwrócił błąd o przekroczeniu liczby Webhooków. Musiałem usunąć całą ową konfigurację z bazy danych. Zwolnij miejsce i ustaw ponownie wszystkie kanały (`globalchat kanał ustaw`)"
                                        )
                                        .addFields({
                                            name: "`Q:` Jak mam usunąć nieużywane webhooki?",
                                            value: '`A:` Wejdź w ustawienia serwera, w zakładkę "Integracje" (W angielskim "Integrations"). Wybierz bota Globally, zjedź na sam dół i, przypatrując się po datach utworzenia, usuń wcześniej utworzone webhooki. Zazwyczaj ten najnowszy może być jeszcze używany.',
                                        })
                                        .setFooter({
                                            text: "Globally, powered by patYczakus",
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
                                db.delete(`serverData/${guildID || "und"}`)
                            }
                            return
                        }
                    })
                    .filter((x) => x)
            )

            GlobalChatMessage.text = await formatText(GlobalChatMessage.text, DiscordClient)
            DiscordMessage.content = await formatText(DiscordMessage.content, DiscordClient)

            const isHisFirstMessage = !lastUser.startsWith(`${GlobalChatMessage.location}:${GlobalChatMessage.author.id}`)
            lastUser = `${GlobalChatMessage.location}:${GlobalChatMessage.author.id}[${isHisFirstMessage}]`
            listenerLog(3, 'ℹ️ Zmienna "lastUser" jest równa "' + lastUser + '"')

            var messages = []
            var editLater = {}

            Promise.all(
                webhooks.map(async function (w) {
                    var a = repliedMessage(w.gid)
                    a = typeof a === "undefined" ? [] : [a]

                    if (typeof prefixes == "string") var _file = require(`./globalactions/${prefixes}`)
                    var comp = {
                        global: [
                            isHisFirstMessage
                                ? [
                                      new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcgi\u0000${DiscordMessage.guildId}`).setEmoji(`ℹ️`),
                                      new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${DiscordMessage.author.id}`).setEmoji(`👤`),
                                      new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`gctab\u0000${GlobalChatMessage.author.id}`).setEmoji("👉"),
                                  ]
                                : [],
                            [
                                typeof prefixes == "string"
                                    ? new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("ga").setDisabled(true).setLabel(`Użyta akcja: ${_file.data.name}`)
                                    : null,
                            ],
                        ]

                            .filter((row) => row && row.filter((x) => x).length > 0)
                            .map((row) => new ActionRowBuilder().addComponents(...row.filter((x) => x))),
                        server: [
                            typeof prefixes == "string"
                                ? [new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId("ga").setDisabled(true).setLabel(`Użyta akcja: ${_file.data.name}`)]
                                : [
                                      new ButtonBuilder()
                                          .setStyle(ButtonStyle.Danger)
                                          .setCustomId(`gcdelete\u0000${DiscordMessage.author.id}\u0000??`)
                                          .setDisabled(true)
                                          .setEmoji("🗑️"),
                                  ],
                        ]
                            .filter((row) => row.filter((x) => x).length > 0)
                            .map((row) => new ActionRowBuilder().addComponents(...row.filter((x) => x))),
                    }

                    var x = await w.wh.send({
                        avatarURL: GlobalChatMessage.author.avatar,
                        username: wbName(w.gid),
                        content: w.gid == DiscordMessage.guildId ? DiscordMessage.content : GlobalChatMessage.text,
                        embeds: a,
                        files: GlobalChatMessage.files,
                        allowedMentions: { parse: [] },
                        components: w.gid == DiscordMessage.guildId ? comp.server : comp.global,
                    })

                    if (w.gid == DiscordMessage.guildId)
                        editLater = {
                            wh: w.wh,
                            message: x.id,
                        }

                    if (typeof prefixes !== "string") messages.push(`${w.gid}/${w.cid}/${x.id}`)

                    return
                })
            ).then(async () => {
                const channelid = "1251618649425449072"
                const channel = await DiscordClient.channels.fetch(channelid)

                if (DiscordMessage.deletable) DiscordMessage.delete()

                if (typeof prefixes == "string") {
                    const file = require(`./globalactions/${prefixes}`)
                    try {
                        /**
                         * @type {WebhookMessageCreateOptions}
                         */
                        var response = await file.execute(GlobalChatMessage.text, DiscordMessage.author)
                        response.avatarURL ??= file.data.avatar
                        response.username ??= file.data.name
                        response.username += ` (${response.username === file.data.name ? "" : `"${file.data.name}", `}GlobalAction)`
                        response.allowedMentions = { parse: [] }

                        if (channel && channel.type === ChannelType.GuildText) {
                            const embed = new EmbedBuilder()
                                .setColor("Blue")
                                .setAuthor({
                                    name: GlobalChatMessage.author.name,
                                    iconURL: DiscordMessage.author.displayAvatarURL({ extension: "webp", size: 64 }),
                                })
                                .setDescription(`Wykonanie akcji *${file.data.name}* \`\`\`${GlobalChatMessage.text}\`\`\``)
                                .setFooter({ text: `${response.username} | ${station}`, iconURL: response.avatarURL })
                            channel.send({
                                embeds: [embed],
                            })
                        }

                        webhooks.map(async function (w) {
                            await w.wh.send(response)

                            return
                        })
                    } catch (err) {
                        if (channel && channel.type === ChannelType.GuildText) {
                            const embed = new EmbedBuilder()
                                .setColor("DarkRed")
                                .setAuthor({
                                    name: GlobalChatMessage.author.name,
                                    iconURL: DiscordMessage.author.displayAvatarURL({ extension: "webp", size: 64 }),
                                })
                                .setDescription(`Niepowodzenie wykonania akcji *${file.data.name}* \`\`\`${GlobalChatMessage.text}\`\`\``)
                                .setFields({ name: "Błąd", value: `\`\`\`${err.message}\`\`\`` })
                                .setFooter({ text: `${station}` })
                            channel.send({
                                embeds: [embed],
                            })
                        }
                        console.error(err)
                        DiscordMessage.channel.send(`Ojoj <@${GlobalChatMessage.author.id}>, złe wieści - owy GlobalAction nie został wykonany zgodnie z oczekiwaniami...`)
                    }
                } else {
                    listenerLog(3, `🌐 Zapisano informację o wiadomości użytkownika`)

                    if (channel && channel.type === ChannelType.GuildText) {
                        let embeds = []
                        const embed = new EmbedBuilder()
                            .setColor("Green")
                            .setAuthor({
                                name: GlobalChatMessage.author.name,
                                iconURL: DiscordMessage.author.displayAvatarURL({ extension: "webp", size: 64 }),
                            })
                            .setDescription(GlobalChatMessage.text || "[ brak tekstu ]")
                            .setFields({
                                name: "Stan",
                                value: "Nie usunięto",
                            })
                            .setFooter({ text: `${station}` })
                        embeds.push(embed)
                        if (GlobalChatMessage.files.length > 0) {
                            const mediaEmbed = new EmbedBuilder().setTitle("Wysłane multimedia").setDescription(GlobalChatMessage.files.join("\n"))
                            embeds.push(mediaEmbed)
                        }
                        var msg = await channel.send({
                            embeds,
                            content: messages.join("|"),
                        })
                        msg.edit({
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcgi\u0000${DiscordMessage.guildId}`).setEmoji(`ℹ️`),
                                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${DiscordMessage.author.id}`).setEmoji(`👤`),
                                    new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`gcdelete\u0000${DiscordMessage.author.id}\u0000${msg.id}`).setEmoji("🗑️")
                                ),
                            ],
                        })

                        editLater.wh.editMessage(editLater.message, {
                            components: [
                                new ActionRowBuilder().addComponents([
                                    new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(`gcdelete\u0000${DiscordMessage.author.id}\u0000${msg.id}`).setEmoji("🗑️"),
                                ]),
                            ],
                        })
                    }
                }

                userData.karma += 1n
                userData.karma += BigInt(typeof prefixes == "string" || GlobalChatMessage.files.length > 0)
                db.set(`userData/${GlobalChatMessage.author.id}/gc`, gcdata.decode(userData))
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
