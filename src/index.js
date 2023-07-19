const { Client, GatewayIntentBits, Webhook } = require("discord.js")
const fs = require("fs")
const { TOKEN, firebaseApp } = require("./config")
const { getDatabase, ref, get } = require("@firebase/database")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.on("ready", () => {
    console.log("✅ Zalogowany poprawnie")

    var slashCommandFiles = fs
        .readdirSync("./src")
        .filter((file) => file.endsWith(".command.js"))

    var cmdLists = []

    for (const file of slashCommandFiles) {
        const slashCommand = require(`./${file}`)
        cmdLists[cmdLists.length] = {
            name: slashCommand.data.name,
            description: slashCommand.data.description,
            options: slashCommand.data.options,
        }
    }
    client.application.commands.set(cmdLists).then(() => {
        console.log("  ✅ Ustawiono pomyślnie komendy")
    })
})

client.on("messageCreate", (msg) => {
    function cfiles() {
        var l = []
        msg.attachments.forEach((file) => {
            l[l.length] = file.url
        })
        return l
    }
    const glist = {
        text: msg.content,
        msgID: msg.id,
        author: {
            id: msg.author.id,
            name:
                msg.author.discriminator == "0"
                    ? msg.author.username
                    : `${msg.author.username}#${msg.author.discriminator}`,
            isUser: !msg.author.bot && !msg.author.system,
            avatar: msg.author.avatarURL({
                extension: "png",
            }),
        },
        location: `${msg.guildId}/${msg.channelId}`,
        files: cfiles(),
    }

    delete cfiles

    if (glist.author.isUser) {
        get(ref(getDatabase(firebaseApp), "globalchat/channels")).then(
            (snapshot) => {
                var dataJSON = new Map()
                dataJSON = JSON.parse(JSON.stringify(snapshot.val()))
                var dataObject = []
                Object.keys(dataJSON).forEach((guild) => {
                    dataObject[
                        dataObject.length
                    ] = `${guild}/${dataJSON[guild]}`
                })

                if (dataObject.includes(glist.location)) {
                    dataObject[dataObject.indexOf(glist.location)] = null

                    dataObject.forEach((channel) => {
                        if (channel != null) {
                            const gchannelID = channel.split("/")[1]
                            const gguildID = channel.split("/")[0]
                            const gguild = client.guilds.cache.get(gguildID)
                            const gchannel =
                                client.channels.cache.get(gchannelID)

                            if (gguild != null && gchannel != null) {
                                //jako wiadomość tworzy tymczasowego webhooka. Nazwa webhooka powinna mieć coś w stylu: "{glist.author.name} ({glist.author.id}) | ${glist.location}", avatar webhooka powinna mieć ta, jaka jest zawarta w glist.author.avatar i wysłać wiadomość o treści w zmiennej glist.text. Jeżeli ma jakieś załączone pliki, należy je umieścić; są one podane w glist.files[]. Oczywiście trzeba uwzględnić discord.js
                                gguild.channels
                                    .createWebhook({
                                        channel: gchannelID,
                                        name: `${glist.author.name} (${glist.author.id}) | ${glist.location}`,
                                        avatar: glist.author.avatar,
                                    })
                                    .then((webhook) => {
                                        webhook
                                            .send({
                                                content: glist.text,
                                                files: glist.files,
                                            })
                                            .then(() => {
                                                webhook.delete()
                                            })
                                    })
                            }
                        }
                    })
                }
            },
        )
    }
})

client.on("interactionCreate", (int) => {
    if (int.isCommand()) {
        const file = require(`./${int.commandName}.command`)
        file.execute(client, int)
    }
})

client.login(TOKEN)
