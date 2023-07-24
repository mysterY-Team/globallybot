const { Client, GatewayIntentBits, Webhook } = require("discord.js")
const fs = require("fs")
const { TOKEN, firebaseApp, customEmoticons } = require("./config")
const { getDatabase, ref, get } = require("@firebase/database")
const { channel } = require("diagnostics_channel")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

function listenerLog(space, info) {
    var text = ""
    for (let index = 1; index < space; index++) {
        text += "   |"
    }
    if (space > 0) text += "   "
    text += info

    console.log(text)
}

listenerLog(0, "Discord.js v.14")
listenerLog(
    1,
    "⚠️ Jako, że to działa na poziomie GitHuba, jest duże prawdopodobieństwo, że się rozłączy z powodu nieaktywności.",
)
console.log()

client.on("ready", (log) => {
    listenerLog(
        0,
        `✅ Zalogowany poprawnie jako ${log.user.username}#${log.user.discriminator}`,
    )
    listenerLog(1, `[+] Dodawanie komend...`)

    var slashCommandFiles = fs
        .readdirSync("./src")
        .filter((file) => file.endsWith(".command.js"))
    var cmdLists = []

    for (const file of slashCommandFiles) {
        const slashCommand = require(`./${file}`)
        cmdLists[cmdLists.length] = slashCommand.data
        listenerLog(2, `[/] Wykryto ${slashCommand.data.name}`)
    }
    client.application.commands.set(cmdLists).then(() => {
        listenerLog(1, "✅ Ustawiono pomyślnie komendy!")
        listenerLog(1, "👂 Nasłuchiwanie akcji bota...")
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
        listenerLog(2, "")
        listenerLog(2, "📩 Odebrano wiadomość od użytkownika!")
        listenerLog(3, `👤 ${glist.author.name} (${glist.author.id})`)
        listenerLog(3, `📌 Lokalizacja: ${glist.location}`)

        //pobieranie bazy danaych - kanały
        get(ref(getDatabase(firebaseApp), "globalchat/channels")).then(
            (channel_snpsht) => {
                listenerLog(
                    3,
                    "💾 Pobrano bazę danych (Firebase/globalchat/channels)",
                )

                //JSON => lista
                var dataObject = []
                Object.keys(channel_snpsht.val()).forEach((loc) => {
                    dataObject[dataObject.length] = `${loc}/${
                        channel_snpsht.val()[loc]
                    }`
                })

                if (dataObject.includes(glist.location)) {
                    listenerLog(4, "✅ Ten kanał znajduje się w bazie danych!")
                    listenerLog(
                        3,
                        `📂 Ilość plików (img i vid): ${glist.files.length}`,
                    )
                    listenerLog(3, "💬 Treść wiadomości:")
                    listenerLog(4, glist.text)

                    //usuwanie kanału
                    dataObject[dataObject.indexOf(glist.location)] = null

                    //pobieranie bazy danych - CZARNA lista
                    get(
                        ref(getDatabase(firebaseApp), "globalchat/userblocks"),
                    ).then((bl_snpsht) => {
                        listenerLog(
                            3,
                            "💾 Pobrano bazę danych (Firebase/globalchat/userblocks)",
                        )

                        if (bl_snpsht.val().includes(glist.author.id)) {
                            msg.react(customEmoticons.denided)
                            listenerLog(
                                4,
                                "❌ Ta osoba jest na czarnej liście GlobalChata!",
                            )
                            return
                        }

                        listenerLog(
                            4,
                            "✅ Tej osoby nie ma na czarnej liście GlobalChata!",
                        )
                        listenerLog(3, "🗨️ Wysyłanie do reszty kanałów...")

                        dataObject.forEach((lgchannel) => {
                            if (lgchannel == null) return

                            const gchannelID = lgchannel.split("/")[1]
                            const gguildID = lgchannel.split("/")[0]
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
                                                listenerLog(
                                                    4,
                                                    `🌐 Wysłano wiadomość za pomocą Webhooka na serwerze ${gguild.name.toUpperCase()}`,
                                                )
                                                listenerLog(
                                                    5,
                                                    `📌 Lokalizacja: ${lgchannel}`,
                                                )
                                            })
                                    })
                            }
                        })
                    })
                } else {
                    listenerLog(
                        4,
                        "❌ Ten kanał znajduje się w bazie danych! Odrzucanie...",
                    )
                }
            },
        )
    }
})

client.on("interactionCreate", (int) => {
    listenerLog(2, "")
    listenerLog(2, "🎚️ Wyłapano interakcję!")
    listenerLog(3, `👤 ${int.user.username} (${int.user.id})`)
    listenerLog(3, `📌 ${int.guildId}/${int.channelId}`)
    if (int.isCommand()) {
        listenerLog(4, "🔎 Typ: Komenda")
        listenerLog(
            5,
            `[/] ${int.commandName} ${
                int.options._subcommand == null ? "" : int.options._subcommand
            }`,
        )
        listenerLog(5, `🖇️ Argumenty: `)

        if (int.options._hoistedOptions.length)
            int.options._hoistedOptions.forEach((arg) => {
                listenerLog(6, `📎 ${arg.name}`)
                listenerLog(7, `🖊️  ${arg.value}`)
                listenerLog(7, `[#] ${arg.type}`)
            })
        else {
            listenerLog(6, `❌ Brak`)
        }
        const file = require(`./${int.commandName}.command`)
        file.execute(client, int)
    }
})

client.login(TOKEN)
