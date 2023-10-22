const { Client, Message, EmbedBuilder, WebhookClient } = require("discord.js")
const { getDatabase, ref, get, remove, set } = require("@firebase/database")
const { firebaseApp, customEmoticons, supportServer, ownersID } = require("./config")
const axios = require("axios")
const fs = require("fs")

/**
 * GlobalChat v2
 * @param {Client<true>} DiscordClient
 * @param {Message<true>} DiscordMessage
 * @param {{ text: string, msgID: string, author: { id: string, name: string, isUser: boolean, avatar: string | null }, location: string, files: string[] }} GlobalChatMessage
 */
function globalchatFunction(DiscordClient, DiscordMessage, GlobalChatMessage) {
    if ((GlobalChatMessage.text.includes("discord.gg/") || GlobalChatMessage.text.includes("disboard.org/")) && !ownersID.includes(GlobalChatMessage.author.id)) {
        DiscordMessage.react(customEmoticons.denided)
        return
    }

    //działanie komentarzy w wiadomości
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

    if (DiscordMessage.reference != null) {
        var replayedMSG = DiscordMessage.channel.messages.cache.get(DiscordMessage.reference.messageId)
        if (replayedMSG.author.bot) {
            var rContent = replayedMSG.content

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
                        .filter((c) => !c.startsWith("<##> ") && !c.startsWith("> "))
                        .join("\n")
                }

                return x
            })
            rContent = rContent.map((x) => x.text).join("```")
            rContent = rContent
                .split("\n")
                .map(function (x) {
                    return "> " + x
                })
                .join("\n")

            var rUser = replayedMSG.author.username.split(" | ")[0]
            var rServer = replayedMSG.author.username.split(" | ")[1]
            if (rServer == "[ ten serwer ]") {
                rServer = DiscordMessage.guild.name
            }
            if (rUser.includes(" (")) {
                rUser = rUser.split(" (")[0]
            }
            if (replayedMSG.attachments.size > 0) {
                rContent = `${rContent != "" ? `${rContent}\n> \n` : ""}> ${replayedMSG.attachments
                    .map(function (x) {
                        return `[\`${x.name}\`](<${x.url}>)`
                    })
                    .join(" | ")}`
            }
            rContent += `\n>    *~${rUser} (${rServer})*`

            GlobalChatMessage.text = `${rContent}${GlobalChatMessage.text == "" ? "" : `\n\n${GlobalChatMessage.text}`}`
            DiscordMessage.content = `${rContent} [\`skocz tam\`](${replayedMSG.url})${DiscordMessage.content == "" ? "" : `\n\n${DiscordMessage.content}`}`
        }
    }

    if (GlobalChatMessage.author.isUser) {
        function wbName(gID) {
            var a = [
                {
                    id: supportServer.id,
                    tag: "[ support ]",
                },
            ]

            a = a.filter((x) => x.id == DiscordMessage.guildId)

            return DiscordMessage.guildId != gID
                ? `${GlobalChatMessage.author.name} (${GlobalChatMessage.author.id}) | ${DiscordMessage.guild.name} ${a.length == 1 ? a[0].tag : ""}`
                : `${GlobalChatMessage.author.name} | [ ten serwer ]`
        }

        get(ref(getDatabase(firebaseApp), "globalchat")).then(async (snpsht) => {
            var database = snpsht.val()

            if (
                !Object.values(database.channels)
                    .map((x) => x.channel)
                    .includes(DiscordMessage.channelId)
            )
                return

            if (database.userblocks.includes(GlobalChatMessage.author.id)) {
                DiscordMessage.react(customEmoticons.denided)
                return
            }

            var webhooks = await Promise.all(
                Object.keys(database.channels).map(async function (guildID) {
                    /**
                     * @type {WebhookClient}
                     */
                    var webhook

                    //sprawdzanie, czy wgl istnieje serwer i kanał
                    const guild_DClient = DiscordClient.guilds.cache.get(guildID)
                    if (typeof guild_DClient != "undefined") {
                        //console.log(await guild_DClient.fetchOwner())
                        const channel_DClient = guild_DClient.channels.cache.get(database.channels[guildID].channel)
                        if (typeof channel_DClient != "undefined") {
                            try {
                                var HTTPWebhookInfo = await axios.get(database.channels[guildID].webhook)
                                if (HTTPWebhookInfo.status >= 200 && HTTPWebhookInfo.status < 300)
                                    webhook = new WebhookClient({
                                        url: database.channels[guildID].webhook,
                                    })

                                return { wh: webhook, toChange: true }
                            } catch (err) {
                                webhook = await guild_DClient.channels.createWebhook({
                                    name: "GlobalChat",
                                    channel: database.channels[guildID].channel,
                                    reason: "wykonania usługi GlobalChat (brakujący Webhook)",
                                })
                                set(ref(getDatabase(firebaseApp), `globalchat/channels/${guildID}/webhook`), webhook.url)

                                return { wh: webhook, toChange: false }
                            }
                        } else {
                            guild_DClient.fetchOwner().then((gguildOwner) => {
                                //embed z informacją o braku kanału
                                const embedError = new EmbedBuilder()
                                    .setTitle("Nieznaleziony kanał")
                                    .setDescription(
                                        "W trakcie wykonywania usługi GlobalChat, nie udało mi się znaleźć kanału, do którego był ono przypisany - dzieje się tak, gdy kanał został usunięty. Usunięto przed chwilą z bazy danych informacje dla tego serwera i należy jeszcze raz ustawić kanał pod komendą `/globalchat kanał ustaw`."
                                    )
                                    .addFields({
                                        name: "`Q:` Kanał przypisany do GlobalChata dalej istnieje, nie został on usunięty.",
                                        value: "`A:` Pobierając kanał, nie zwróciło po prostu poprawnej wartości, a dane usunięto. Należy spróbować ustawić kanał, jeżeli trzy próby zakończą się niepowodzeniem, należy **natychmiast zgłosić to supportowi** - do właściciela `patyczakus`, czy do [serwera support](https://discord.gg/536TSYqT)",
                                    })
                                    .setFooter({
                                        text: "Globally, powered by patYczakus",
                                    })
                                    .setColor("Orange")

                                gguildOwner.send({
                                    content: `${customEmoticons.info} Tu bot Globally. Jako, że jesteś właścicielem serwera *${guild_DClient.name}*, jest bardzo ważna informacja dla Ciebie!`,
                                    embeds: [embedError],
                                })

                                remove(ref(getDatabase(firebaseApp), `globalchat/channels/${guildID}`))
                                delete database.channels[guildID]
                                return
                            })
                        }
                    } else {
                        remove(ref(getDatabase(firebaseApp), `globalchat/channels/${guildID}`))
                        delete database.channels[guildID]
                        return
                    }
                })
            )

            Promise.all(
                webhooks.map(async function (w) {
                    var HTTPWebhookInfo = await axios.get(w.wh.url)

                    await w.wh.send({
                        avatarURL: GlobalChatMessage.author.avatar,
                        username: wbName(HTTPWebhookInfo.data.guild_id),
                        content: HTTPWebhookInfo.data.guild_id == DiscordMessage.guildId ? DiscordMessage.content : GlobalChatMessage.text,
                        files: GlobalChatMessage.files,
                        allowedMentions: { parse: [] },
                    })

                    return
                })
            ).then(async () => {
                database.gpt.messages = typeof database.gpt.messages == "undefined" ? [] : database.gpt.messages
                if (database.gpt.messages.length == 10) {
                    database.gpt.messages.shift()
                }
                database.gpt.messages.push(
                    `<${GlobalChatMessage.author.name} (ID: ${GlobalChatMessage.author.id}, Serwer: ${DiscordMessage.guild.name})> ${GlobalChatMessage.text}`
                )
                await set(ref(getDatabase(firebaseApp), "globalchat/gpt/messages"), database.gpt.messages)

                DiscordMessage.delete()

                var prefixes = fs.readdirSync("./src/globalactions/").map((x) => x.replace(".js", ""))

                for (var i = 0; i < prefixes.length; i++) {
                    if (GlobalChatMessage.text.toLowerCase().startsWith(prefixes[i] + ",")) {
                        prefixes = prefixes[i]
                        break
                    }
                }

                if (typeof prefixes == "string") {
                    const file = require(`./globalactions/${prefixes}`)
                    const response = await file.execute(GlobalChatMessage.text)

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

                    database.gpt.messages = typeof database.gpt.messages == "undefined" ? [] : database.gpt.messages
                    if (database.gpt.messages.length == 10) {
                        database.gpt.messages.shift()
                    }
                    database.gpt.messages.push(`<${file.data.name} (GlobalAction)> ${response.content} ${"embeds" in response ? `(Osadzeń: ${response.embeds.length})` : ""}`)
                    await set(ref(getDatabase(firebaseApp), "globalchat/gpt/messages"), database.gpt.messages)
                }
            })

            // /*
            //  * @type {Webhook[]}
            //  */
            // var webhooksList = []
            // var database = snpsht.val()
            // var channelsSend = 0

            // var GlobalAction = {
            //     dowcip: function () {
            //         try {
            //             channelsSend = 0
            //             axios.get("https://perelki.net/random").then((response) => {
            //                 const $ = cheerio.load(response.data)
            //                 $(".content .container:not(.cntr) .about").remove()
            //                 var joke = $(".content .container:not(.cntr)")
            //                     .html()
            //                     .replace(/<br>/g, "\n")
            //                     .replace(/\*/g, "\\*")
            //                     .replace(/_/g, "\\_")
            //                     .replace(/~/g, "\\~")
            //                     .replace(/#/g, "\\#")
            //                     .replace(/@/g, "\\@")
            //                     .trim()
            //                 joke = joke
            //                     .split("\n")
            //                     .filter((line) => line != "")
            //                     .join("\n")
            //                 Promise.all(gchannels.map((gch) => gch.sendTyping())).then(() => {
            //                     webhooksList.forEach((webhook2) => {
            //                         webhook2
            //                             .edit({
            //                                 name: "Memiarz (GlobalAction)",
            //                                 avatar: "https://www.pngarts.com/files/11/Haha-Emoji-Transparent-Image.png",
            //                                 reason: "Użycie GlobalAction",
            //                             })
            //                             .then((wh) => {
            //                                 wh.send({
            //                                     content: `Udało się znaleźć dowcip ze strony [**perelki.net**](<https://perelki.net>)\n\n${joke}`,
            //                                 }).then(() => {
            //                                     channelsSend++
            //                                     if (channelsSend >= dataObject.length) {
            //                                         set(
            //                                             ref(getDatabase(firebaseApp), "globalchat/gptUses/i"),
            //                                             database.gptUses.i + 1
            //                                         )
            //                                         webhooksList.forEach((webhook2) => {
            //                                             webhook2.delete(
            //                                                 `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
            //                                             )
            //                                         })
            //                                     }
            //                                 })
            //                             })
            //                     })
            //                 })
            //             })
            //         } catch (error) {
            //             webhooksList.forEach((webhook2) => {
            //                 webhook2.delete(`zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`)
            //             })
            //         }
            //     },
            //     GPT: function () {
            //         channelsSend = 0
            //         Promise.all(gchannels.map((gch) => gch.sendTyping())).then(() => {
            //                 try {
            //                     webhooksList.forEach((webhook2) => {
            //                         webhook2
            //                             .edit({
            //                                 name: "ChatGPT (GlobalAction)",
            //                                 avatar: "https://capiche.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbU5GIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2828502fa3c2cd9130a2a1df1d35ba7b0f9270c1/openai-avatar.png",
            //                                 reason: "Użycie GlobalAction",
            //                             })
            //                             .then((wh) => {
            //                                 var embedReached = new EmbedBuilder()
            //                                     .setColor("Orange")
            //                                     .setDescription(
            //                                         `${customEmoticons.denided} Wybacz, ale jedynie mogę odpowiadać 10 razy na dzień!`
            //                                     )
            //                                 wh.send({
            //                                     content: database.gptUses.i < 10 ? response.data : "",
            //                                     embeds: database.gptUses.i < 10 ? [] : [embedReached],
            //                                 }).then(() => {
            //                                     channelsSend++
            //                                     if (channelsSend >= dataObject.length) {
            //                                         set(
            //                                             ref(getDatabase(firebaseApp), "globalchat/gptUses/i"),
            //                                             database.gptUses.i + 1
            //                                         )
            //                                         webhooksList.forEach((webhook2) => {
            //                                             webhook2.delete(
            //                                                 `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
            //                                             )
            //                                         })
            //                                     }
            //                                 })
            //                             })
            //                     })
            //                 } catch (err) {
            //                     webhooksList.forEach((webhook2) => {
            //                         webhook2.delete(
            //                             `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
            //                         )
            //                     })
            //                 }
            //             })
            //         })
            //     },
            // }

            // //JSON => lista
            // var dataObject = []
            // Object.keys(database.channels).forEach((loc) => {
            //     dataObject[dataObject.length] = `${loc}/${database.channels[loc]}`
            // })

            // if (dataObject.includes(GlobalChatMessage.location)) {
            //     //sprawdzanie linijek komentarzy, zaczynawszy od <##>
            //     GlobalChatMessage.text = GlobalChatMessage.text.split("\n").filter((line) => !line.startsWith("<##> "))
            //     if (GlobalChatMessage.text.length > 0) {
            //         GlobalChatMessage.text = GlobalChatMessage.text.join("\n")
            //     } else {
            //         return
            //     }

            //     //pobieranie bazy danych - CZARNA lista

            //     if (database.userblocks.includes(GlobalChatMessage.author.id)) {
            //         DiscordMessage.react(customEmoticons.denided)
            //         return
            //     }

            //     //ostatnie blokady
            //     //ewentualnie usunięcie pingów, jeżeli nie jest na liście właścicieli bota
            //     GlobalChatMessage.text = GlobalChatMessage.text
            //         .replace(/@everyone/g, "||`[ niedozwolony ping ]`||")
            //         .replace(/@here/g, "||`[ niedozwolony ping ]`||")

            //     //jeżeli jest to link niedozwolony (taki, który szkodzi wirusem lub zapraszający na inny serwer Discord), nie wysyła wcale do kanałów
            //     if (
            //         //linki zaproszeniowe
            //         GlobalChatMessage.text.includes("discord.gg") ||
            //         GlobalChatMessage.text.includes("disboard.com") ||
            //         //linki z pornografią
            //         (GlobalChatMessage.text.includes("porn") && GlobalChatMessage.text.includes(".com")) || //ogólna definicja
            //         GlobalChatMessage.text.includes("xvideos.com") ||
            //         GlobalChatMessage.text.includes("hanime.tv")
            //     ) {
            //         DiscordMessage.react(customEmoticons.denided)
            //         return
            //     }

            //     /**
            //      * @type {import("discord.js").GuildBasedChannel[]}
            //      */
            //     var gchannels = []

            //     dataObject.forEach((lgchannel) => {
            //         if (lgchannel == null) return

            //         const gchannelID = lgchannel.split("/")[1]
            //         const gguildID = lgchannel.split("/")[0]
            //         const gguild = DiscordClient.guilds.cache.get(gguildID)
            //         if (typeof gguild == "undefined") {
            //             remove(ref(getDatabase(firebaseApp), `globalchat/channels/${gguildID}`))
            //             return
            //         }
            //         gguild.channels.fetch(gchannelID).then((gchannel) => {
            //             if (gchannel == null) {
            //                 remove(ref(getDatabase(firebaseApp), `globalchat/channels/${gguildID}`)).then(() => {

            //                 })
            //                 return
            //             }
            //             gchannels[gchannels.length] = gchannel
            //             gguild.channels
            //                 .createWebhook({
            //                     channel: gchannelID,
            //                     name:
            //                         gguildID == DiscordMessage.guildId
            //                             ? `${GlobalChatMessage.author.name} | [ ten serwer ]`
            //                             : `${GlobalChatMessage.author.name} (${GlobalChatMessage.author.id}) | ${DiscordMessage.guild.name}`,
            //                     avatar: GlobalChatMessage.author.avatar,
            //                     reason: `użycia usługi GlobalChat przez użytkownika ${GlobalChatMessage.author.name.toUpperCase()}`,
            //                 })
            //                 .then((webhook) => {
            //                     webhook
            //                         .send({
            //                             content:
            //                                 gguildID == DiscordMessage.guildId
            //                                     ? DiscordMessage.content
            //                                           .replace(/@everyone/g, "||`[ niedozwolony ping ]`||")
            //                                           .replace(/@here/g, "||`[ niedozwolony ping ]`||")
            //                                     : GlobalChatMessage.text,
            //                             files: GlobalChatMessage.files,
            //                         })
            //                         .then(() => {
            //                             webhooksList.push(webhook)
            //                             //console.log(generateGPTFormatter(DiscordMessage, GlobalChatMessage, database))
            //                             channelsSend++
            //                             if (channelsSend >= dataObject.length) {
            //                                 DiscordMessage.delete()
            //                                 //console.log(DiscordMessage)
            //                                 if (GlobalChatMessage.text.toLowerCase().startsWith("gpt, ")) {
            //                                     GlobalAction.GPT()
            //                                 } else if (
            //                                     GlobalChatMessage.text
            //                                         .toLowerCase()
            //                                         .startsWith("memiarz, opowiedz dowcip")
            //                                 ) {
            //                                     GlobalAction.dowcip()
            //                                 } else
            //                                     webhooksList.forEach((webhook2) => {
            //                                         webhook2.delete(
            //                                             `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
            //                                         )
            //                                     })
            //                             }
            //                         })
            //                 })
            //         })
            //     })
            // } else {
            // }
        })
    }
}

module.exports = {
    globalchatFunction,
}
