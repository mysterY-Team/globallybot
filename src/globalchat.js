const { Client, Message, EmbedBuilder, WebhookClient } = require("discord.js")
const { getDatabase, ref, get, remove, set } = require("@firebase/database")
const { firebaseApp, customEmoticons, supportServer, ownersID, GCmodsID } = require("./config")
const axios = require("axios")
const fs = require("fs")
const { emoticons } = require("./cmds/globalchat/emotki")
const { listenerLog } = require("./functions/listenerLog")

const timestampCooldown = new Date()
const cooldown = 2000

/**
 * GlobalChat v2
 * @param {Client<true>} DiscordClient
 * @param {Message<true>} DiscordMessage
 * @param {{ text: string, msgID: string, author: { id: string, name: string, isUser: boolean, avatar: string | null }, location: string, files: string[] }} GlobalChatMessage
 */
function globalchatFunction(DiscordClient, DiscordMessage, GlobalChatMessage) {
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
        var a = [
            {
                id: supportServer.id,
                tag: "[ support ]",
            },
        ]

        a = a.filter((x) => x.id == DiscordMessage.guildId)

        return DiscordMessage.guildId != gID
            ? `${GlobalChatMessage.author.name} (${GlobalChatMessage.author.id}) || ${DiscordMessage.guild.name} ${a.length == 1 ? a[0].tag : ""}`
            : `${GlobalChatMessage.author.name} || [ ten serwer ]`
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

                //działanie komentarzy w odpowiadanej wiadomości + cytowań
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

                const _repl = replayedMSG.author.username.split(" || ")
                var rUser, rServer

                rUser = _repl[0]
                if (_repl.length == 1) {
                    rServer = ""
                } else {
                    rServer = _repl[1].split(" [")[0]
                    if (rServer === "[ ten serwer ]") {
                        rServer = DiscordMessage.guild.name
                    }
                    if (rUser.includes(" (")) {
                        rUser = rUser.split(" (")[0]
                    }
                }

                var embed = { iconURL: replayedMSG.author.avatarURL({ extension: "png" }), name: `W odpowiedzi do ${rUser}${rServer === "" ? "" : ` ze serwera ${rServer}`}` }
                if (gID == DiscordMessage.guildId) embed.url = replayedMSG.url
                embed = new EmbedBuilder().setAuthor(embed).setDescription(rContent).setTimestamp(replayedMSG.createdTimestamp)
                if (gID == DiscordMessage.guildId) embed = embed.setFooter({ text: "Kliknięcie w nagłówek spowoduje przeniesienie do odpowiadanej wiadomości" })
                if (replayedMSG.attachments.size > 0) {
                    rAttachments = replayedMSG.attachments.map((x) => `[\`${x.name}\`](<${x.url}>)`).join("\n")
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
        get(ref(getDatabase(firebaseApp), "serverData")).then(async (snpsht) => {
            var database = snpsht.val()

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

            var userData = await get(ref(getDatabase(firebaseApp), `userData/${GlobalChatMessage.author.id}/gc`))
            if (userData.exists()) userData = userData.val()
            else {
                DiscordMessage.author.send(`${customEmoticons.info} Nie został zarejestrowany profil GlobalChat! Utwórz pod komendą \`profil utwórz typ:GlobalChat\``)
                DiscordMessage.react(customEmoticons.minus)
                return
            }

            listenerLog(3, "➿ Spełniono warunek (2/6)")

            if (userData.block.is) {
                DiscordMessage.react(customEmoticons.denided)
                return
            }

            listenerLog(3, "➿ Spełniono warunek (3/6)")

            if ((GlobalChatMessage.text.includes("discord.gg/") || GlobalChatMessage.text.includes("disboard.org/")) && !ownersID.includes(GlobalChatMessage.author.id)) {
                DiscordMessage.react(customEmoticons.denided)
                return
            }

            listenerLog(3, "➿ Spełniono warunek (4/6)")

            if (timestampCooldown.getTime() + cooldown > new Date().getTime()) {
                DiscordMessage.reply(`${customEmoticons.denided} Globalny cooldown! Zaczekaj jeszcze \`${cooldown - (new Date().getTime() - timestampCooldown.getTime())}\` ms`)
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
                                try {
                                    var HTTPWebhookInfo = await axios.get(getDataByServerID(guildID).webhook)
                                    if (HTTPWebhookInfo.status >= 200 && HTTPWebhookInfo.status < 300)
                                        webhook = new WebhookClient({
                                            url: getDataByServerID(guildID).webhook,
                                        })

                                    return { wh: webhook, toChange: true }
                                } catch (err) {
                                    webhook = await guild_DClient.channels.createWebhook({
                                        name: "GlobalChat",
                                        channel: getDataByServerID(guildID).channel,
                                        reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                    })
                                    set(ref(getDatabase(firebaseApp), `serverData/${guildID}/gc/${station}/webhook`), webhook.url)

                                    return { wh: webhook, toChange: false }
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

                                    remove(ref(getDatabase(firebaseApp), `serverData/${guildID}/gc/${station}`))
                                    return
                                })
                            }
                        } else {
                            remove(ref(getDatabase(firebaseApp), `serverData/${guildID}/gc/${station}`))
                            return
                        }
                    })
            )

            for (var i = 0; i < emoticons.length; i++) {
                var _e = emoticons[i].savenames
                GlobalChatMessage.text = GlobalChatMessage.text.replace(
                    new RegExp(`${_e.map((x) => `{e:${x.replace(/\./g, "\\.")}}`).join("|")}|${_e.map((x) => `{emote:${x.replace(/\./g, "\\.")}}`).join("|")}`, "g"),
                    emoticons[i].emote
                )
                DiscordMessage.content = DiscordMessage.content.replace(
                    new RegExp(`${_e.map((x) => `{e:${x.replace(/\./g, "\\.")}}`).join("|")}|${_e.map((x) => `{emote:${x.replace(/\./g, "\\.")}}`).join("|")}`, "g"),
                    emoticons[i].emote
                )
            }

            Promise.all(
                webhooks.map(async function (w) {
                    var HTTPWebhookInfo = await axios.get(w.wh.url)

                    var a = repliedMessage(HTTPWebhookInfo.data.guild_id)
                    a = typeof a === "undefined" ? [] : [a]

                    if (typeof prefixes == "string") {
                        var _file = require(`./globalactions/${prefixes}`)
                        a.push(
                            new EmbedBuilder()
                                .setColor("#663399")
                                .setDescription(
                                    `Użytkownik właśnie użył GlobalAction o nazwie *${_file.data.name}*. Możesz się o nich dowiedzieć więcej pod komendą \`globalchat globalactions about\``
                                )
                        )
                    }

                    await w.wh.send({
                        avatarURL: GlobalChatMessage.author.avatar,
                        username: wbName(HTTPWebhookInfo.data.guild_id),
                        content: HTTPWebhookInfo.data.guild_id == DiscordMessage.guildId ? DiscordMessage.content : GlobalChatMessage.text,
                        embeds: a,
                        files: GlobalChatMessage.files,
                        allowedMentions: { parse: [] },
                    })

                    return
                })
            ).then(async () => {
                var gptdata = await get(ref(getDatabase(firebaseApp), "globalgpt"))
                gptdata = gptdata.val()

                gptdata.messages = typeof gptdata.messages == "undefined" ? [] : gptdata.messages
                if (gptdata.messages.length == 10) {
                    gptdata.messages.shift()
                }
                gptdata.messages.push(
                    `<${GlobalChatMessage.author.name} (ID: ${GlobalChatMessage.author.id}, Serwer: ${DiscordMessage.guild.name})> "${GlobalChatMessage.text}" (plików: ${GlobalChatMessage.files.length})`
                )

                DiscordMessage.delete()

                if (typeof prefixes == "string") {
                    const file = require(`./globalactions/${prefixes}`)
                    const response = await file.execute(GlobalChatMessage.text, DiscordMessage.author, DiscordMessage.reference)

                    webhooks.map(async function (w) {
                        await w.wh.send(
                            Object.assign(response, {
                                avatarURL: file.data.avatar,
                                username: `${file.data.name} (GlobalAction)`,
                                allowedMentions: { parse: [] },
                            })
                        )

                        return
                    })

                    if (gptdata.messages.length == 10) {
                        gptdata.messages.shift()
                    }
                    gptdata.messages.push(`<${file.data.name} (GlobalAction)> "${response.content}"${"embeds" in response ? ` (osadzeń: ${response.embeds.length})` : ``}`)
                }
                await set(ref(getDatabase(firebaseApp), "globalgpt/messages"), gptdata.messages)
            })
        })
    }
}

module.exports = {
    globalchatFunction,
}
