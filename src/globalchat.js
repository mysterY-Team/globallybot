const { Client, Message, EmbedBuilder, Webhook, GuildTextThreadManager } = require("discord.js")
const { getDatabase, ref, get, remove, set } = require("@firebase/database")
const { firebaseApp, customEmoticons, ownersID } = require("./config")
const axios = require("axios")
const cheerio = require("cheerio")

function generateGPTFormatter(DM, GCM) {
    return `${GCM.text}
[Informacje: 
Nazwa użytkownika: ${GCM.author.name} ${ownersID.includes(GCM.author.id) ? "(jest właścicielem bota)" : ""}
Nazwa serwera, gdzie pochodzi wiadomość: ${DM.guild.name}]`
}

/**
 * @param {Client<true>} DiscordClient
 * @param {Message<true>} DiscordMessage
 * @param {{ text: string, msgID: string, author: { id: string, name: string, isUser: boolean, avatar: string | null }, location: string, files: string[] }} GlobalChatMessage
 */
function globalchatFunction(DiscordClient, DiscordMessage, GlobalChatMessage) {
    if (GlobalChatMessage.author.isUser) {
        get(ref(getDatabase(firebaseApp), "globalchat")).then((snpsht) => {
            /**
             * @type {Webhook[]}
             */
            var webhooksToDelete = []
            var database = snpsht.val()
            var channelsSend = 0

            var GlobalAction = {
                dowcip: function () {
                    try {
                        channelsSend = 0
                        axios.get("https://perelki.net/random").then((response) => {
                            const $ = cheerio.load(response.data)
                            $(".content .container:not(.cntr) .about").remove()
                            var joke = $(".content .container:not(.cntr)")
                                .html()
                                .replace(/<br>/g, "\n")
                                .replace(/\*/g, "\\*")
                                .replace(/_/g, "\\_")
                                .replace(/~/g, "\\~")
                                .replace(/#/g, "\\#")
                                .replace(/@/g, "\\@")
                                .trim()
                            joke = joke
                                .split("\n")
                                .filter((line) => line != "")
                                .join("\n")
                            Promise.all(gchannels.map((gch) => gch.sendTyping())).then(() => {
                                webhooksToDelete.forEach((webhook2) => {
                                    webhook2
                                        .edit({
                                            name: "Memiarz (GlobalAction)",
                                            avatar: "https://www.pngarts.com/files/11/Haha-Emoji-Transparent-Image.png",
                                            reason: "Użycie GlobalAction",
                                        })
                                        .then((wh) => {
                                            wh.send({
                                                content: `Udało się znaleźć dowcip ze strony [**perelki.net**](<https://perelki.net>)\n\n${joke}`,
                                            }).then(() => {
                                                channelsSend++
                                                if (channelsSend >= dataObject.length) {
                                                    set(
                                                        ref(getDatabase(firebaseApp), "globalchat/gptUses/i"),
                                                        database.gptUses.i + 1
                                                    )
                                                    webhooksToDelete.forEach((webhook2) => {
                                                        webhook2.delete(
                                                            `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
                                                        )
                                                    })
                                                }
                                            })
                                        })
                                })
                            })
                        })
                    } catch (error) {
                        webhooksToDelete.forEach((webhook2) => {
                            webhook2.delete(`zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`)
                        })
                    }
                },
                GPT: function () {
                    channelsSend = 0
                    Promise.all(gchannels.map((gch) => gch.sendTyping())).then(() => {
                        const options = {
                            method: "GET",
                            url: "https://chat-gpt-ai-bot.p.rapidapi.com/GenerateAIWritter",
                            params: {
                                prompt: generateGPTFormatter(DiscordMessage, GlobalChatMessage, database),
                            },
                            headers: {
                                "X-RapidAPI-Key": "2ddf7ebb02msh1a346334811da70p11ad63jsn3982f775ddfd",
                                "X-RapidAPI-Host": "chat-gpt-ai-bot.p.rapidapi.com",
                            },
                        }

                        axios.request(options).then((response) => {
                            try {
                                webhooksToDelete.forEach((webhook2) => {
                                    webhook2
                                        .edit({
                                            name: "ChatGPT (GlobalAction)",
                                            avatar: "https://capiche.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbU5GIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2828502fa3c2cd9130a2a1df1d35ba7b0f9270c1/openai-avatar.png",
                                            reason: "Użycie GlobalAction",
                                        })
                                        .then((wh) => {
                                            var embedReached = new EmbedBuilder()
                                                .setColor("Orange")
                                                .setDescription(
                                                    `${customEmoticons.denided} Wybacz, ale jedynie mogę odpowiadać 10 razy na dzień!`
                                                )
                                            wh.send({
                                                content: database.gptUses.i < 10 ? response.data : "",
                                                embeds: database.gptUses.i < 10 ? [] : [embedReached],
                                            }).then(() => {
                                                channelsSend++
                                                if (channelsSend >= dataObject.length) {
                                                    set(
                                                        ref(getDatabase(firebaseApp), "globalchat/gptUses/i"),
                                                        database.gptUses.i + 1
                                                    )
                                                    webhooksToDelete.forEach((webhook2) => {
                                                        webhook2.delete(
                                                            `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
                                                        )
                                                    })
                                                }
                                            })
                                        })
                                })
                            } catch (err) {
                                webhooksToDelete.forEach((webhook2) => {
                                    webhook2.delete(
                                        `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
                                    )
                                })
                            }
                        })
                    })
                },
            }

            //JSON => lista
            var dataObject = []
            Object.keys(database.channels).forEach((loc) => {
                dataObject[dataObject.length] = `${loc}/${database.channels[loc]}`
            })

            if (dataObject.includes(GlobalChatMessage.location)) {
                //sprawdzanie linijek komentarzy, zaczynawszy od <##>
                GlobalChatMessage.text = GlobalChatMessage.text.split("\n").filter((line) => !line.startsWith("<##> "))
                if (GlobalChatMessage.text.length > 0) {
                    GlobalChatMessage.text = GlobalChatMessage.text.join("\n")
                } else {
                    return
                }

                //pobieranie bazy danych - CZARNA lista

                if (database.userblocks.includes(GlobalChatMessage.author.id)) {
                    DiscordMessage.react(customEmoticons.denided)
                    return
                }

                //ostatnie blokady
                //ewentualnie usunięcie pingów, jeżeli nie jest na liście właścicieli bota
                GlobalChatMessage.text = GlobalChatMessage.text
                    .replace(/@everyone/g, "||`[ niedozwolony ping ]`||")
                    .replace(/@here/g, "||`[ niedozwolony ping ]`||")

                //jeżeli jest to link niedozwolony (taki, który szkodzi wirusem lub zapraszający na inny serwer Discord), nie wysyła wcale do kanałów
                if (
                    //linki zaproszeniowe
                    GlobalChatMessage.text.includes("discord.gg") ||
                    GlobalChatMessage.text.includes("disboard.com") ||
                    //linki z pornografią
                    (GlobalChatMessage.text.includes("porn") && GlobalChatMessage.text.includes(".com")) || //ogólna definicja
                    GlobalChatMessage.text.includes("xvideos.com") ||
                    GlobalChatMessage.text.includes("hanime.tv")
                ) {
                    DiscordMessage.react(customEmoticons.denided)
                    return
                }

                /**
                 * @type {import("discord.js").GuildBasedChannel[]}
                 */
                var gchannels = []

                dataObject.forEach((lgchannel) => {
                    if (lgchannel == null) return

                    const gchannelID = lgchannel.split("/")[1]
                    const gguildID = lgchannel.split("/")[0]
                    const gguild = DiscordClient.guilds.cache.get(gguildID)
                    if (typeof gguild == "undefined") {
                        remove(ref(getDatabase(firebaseApp), `globalchat/channels/${gguildID}`))
                        return
                    }
                    gguild.channels.fetch(gchannelID).then((gchannel) => {
                        if (gchannel == null) {
                            remove(ref(getDatabase(firebaseApp), `globalchat/channels/${gguildID}`)).then(() => {
                                var gguildOwner = DiscordClient.users.cache.get(gguild.ownerId)

                                //embed z informacją o braku kanału
                                const embedError = new EmbedBuilder()
                                    .setTitle("Nieznaleziony kanał")
                                    .setDescription(
                                        "W trakcie wykonywania usługi GlobalChat, nie udało mi się znaleźć kanału, do którego był ono przypisany - dzieje się tak, gdy kanał został usunięty. Usunięto przed chwilą z bazy danych informacje dla tego serwera i należy jeszcze raz ustawić kanał pod komendą `/globalchat kanał ustaw`."
                                    )
                                    .addFields({
                                        name: "`Q:` Kanał przypisany do GlobalChata dalej istnieje, nie został on usunięty.",
                                        value: "`A:` Pobierając kanał, nie zwróciło po prostu poprawnej wartości, a dane usunięto. Należy spróbować ustawić kanał, jeżeli trzy próby zakończą się niepowodzeniem, należy **natychmiast zgłosić to supportowi**, do właściciela `patyczakus`, czy do [serwera support](https://discord.gg/536TSYqT)",
                                    })
                                    .setFooter({ text: "Globally, powered by patYczakus" })
                                    .setColor("Orange")

                                gguildOwner.send({
                                    content: `${customEmoticons.info} Tu bot Globally. Jako, że jesteś właścicielem serwera *${gguild.name}*, jest bardzo ważna informacja dla Ciebie!`,
                                    embeds: [embedError],
                                })
                            })
                            return
                        }
                        gchannels[gchannels.length] = gchannel
                        gguild.channels
                            .createWebhook({
                                channel: gchannelID,
                                name:
                                    gguildID == DiscordMessage.guildId
                                        ? `${GlobalChatMessage.author.name} | [ ten serwer ]`
                                        : `${GlobalChatMessage.author.name} (${GlobalChatMessage.author.id}) | ${DiscordMessage.guild.name}`,
                                avatar: GlobalChatMessage.author.avatar,
                                reason: `użycia usługi GlobalChat przez użytkownika ${GlobalChatMessage.author.name.toUpperCase()}`,
                            })
                            .then((webhook) => {
                                webhook
                                    .send({
                                        content:
                                            gguildID == DiscordMessage.guildId
                                                ? DiscordMessage.content
                                                      .replace(/@everyone/g, "||`[ niedozwolony ping ]`||")
                                                      .replace(/@here/g, "||`[ niedozwolony ping ]`||")
                                                : GlobalChatMessage.text,
                                        files: GlobalChatMessage.files,
                                    })
                                    .then(() => {
                                        webhooksToDelete.push(webhook)
                                        //console.log(generateGPTFormatter(DiscordMessage, GlobalChatMessage, database))
                                        channelsSend++
                                        if (channelsSend >= dataObject.length) {
                                            DiscordMessage.delete()
                                            //console.log(DiscordMessage)
                                            if (GlobalChatMessage.text.toLowerCase().startsWith("gpt, ")) {
                                                GlobalAction.GPT()
                                            } else if (
                                                GlobalChatMessage.text
                                                    .toLowerCase()
                                                    .startsWith("memiarz, opowiedz dowcip")
                                            ) {
                                                GlobalAction.dowcip()
                                            } else
                                                webhooksToDelete.forEach((webhook2) => {
                                                    webhook2.delete(
                                                        `zakańczania usługi GlobalChat (wysłano do ${channelsSend} serwerów)`
                                                    )
                                                })
                                        }
                                    })
                            })
                    })
                })
            } else {
            }
        })
    }
}

module.exports = {
    globalchatFunction,
}
