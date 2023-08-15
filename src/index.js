const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ChannelType,
} = require("discord.js")
const {
    TOKEN,
    firebaseApp,
    customEmoticons,
    ownersID,
    supportServer,
} = require("./config.js")
const { getDatabase, ref, get, remove } = require("@firebase/database")
const { performance } = require("perf_hooks")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

function listenerLog(space, info) {
    var text = ""
    for (let index = 0; index < space; index++) {
        text += "|   "
    }
    text += info

    console.log(text)
}

function splitTime(milliseconds) {
    const millisecondsPerSecond = 1000
    const millisecondsPerMinute = millisecondsPerSecond * 60
    const millisecondsPerHour = millisecondsPerMinute * 60
    const millisecondsPerDay = millisecondsPerHour * 24

    const days = Math.floor(milliseconds / millisecondsPerDay)
    milliseconds %= millisecondsPerDay

    const hours = Math.floor(milliseconds / millisecondsPerHour)
    milliseconds %= millisecondsPerHour

    const minutes = Math.floor(milliseconds / millisecondsPerMinute)
    milliseconds %= millisecondsPerMinute

    const seconds = Math.floor(milliseconds / millisecondsPerSecond)
    milliseconds %= millisecondsPerSecond

    milliseconds = Math.floor(milliseconds)

    return { days, hours, minutes, seconds, milliseconds }
}

function timeLog(what, timeMS) {
    var { days, hours, minutes, seconds, milliseconds } = splitTime(timeMS)
    listenerLog(2, `⌚ Czas działania ${what}`)
    listenerLog(3, `[DNI] ${days}`)
    listenerLog(3, `[GODZ] ${hours}`)
    listenerLog(3, `[MIN] ${minutes}`)
    listenerLog(3, `[SEK] ${seconds}`)
    listenerLog(3, `[MSEK] ${milliseconds}`)
}

listenerLog(0, "Discord.js v.14")
listenerLog(
    1,
    "⚠️ Jako, że to działa na poziomie GitHuba, jest duże prawdopodobieństwo, że się rozłączy z powodu nieaktywności."
)
console.log()

client.on("ready", (log) => {
    listenerLog(
        0,
        `✅ Zalogowany poprawnie jako ${log.user.username}#${log.user.discriminator}`
    )
    listenerLog(1, `[+] Dodawanie komend...`)

    const slashCommandList = require(`./slashcommands.js`)
    client.application.commands.set(slashCommandList.list).then(() => {
        listenerLog(1, "✅ Ustawiono pomyślnie komendy!")
        listenerLog(1, "👂 Nasłuchiwanie akcji bota...")
    })
})

client.on("messageCreate", (msg) => {
    var startTime = performance.now()

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
                    "💾 Pobrano bazę danych (Firebase/globalchat/channels)"
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
                        `📂 Ilość plików (img i vid): ${glist.files.length}`
                    )
                    listenerLog(3, "💬 Treść wiadomości:")
                    listenerLog(4, glist.text)

                    //usuwanie kanału
                    dataObject[dataObject.indexOf(glist.location)] = null

                    //pobieranie bazy danych - CZARNA lista
                    get(
                        ref(getDatabase(firebaseApp), "globalchat/userblocks")
                    ).then((bl_snpsht) => {
                        listenerLog(
                            3,
                            "💾 Pobrano bazę danych (Firebase/globalchat/userblocks)"
                        )

                        if (bl_snpsht.val().includes(glist.author.id)) {
                            msg.react(customEmoticons.denided)
                            listenerLog(
                                4,
                                "❌ Ta osoba jest na czarnej liście GlobalChata!"
                            )
                            timeLog(
                                "bota (pobieranie czasu)",
                                performance.now()
                            )
                            timeLog("kodu GC", performance.now() - startTime)
                            return
                        }

                        listenerLog(
                            4,
                            "✅ Tej osoby nie ma na czarnej liście GlobalChata!"
                        )

                        //ostatnie blokady
                        //ewentualnie usunięcie pingów, jeżeli nie jest na liście właścicieli bota
                        if (!ownersID.includes(glist.author.id))
                            glist.text = glist.text
                                .replace(
                                    /@everyone/g,
                                    "||`[ niedozwolony ping ]`||"
                                )
                                .replace(
                                    /@here/g,
                                    "||`[ niedozwolony ping ]`||"
                                )

                        //jeżeli jest to link niedozwolony (taki, który szkodzi użytkownikowi wirusem lub zapraszający na inny serwer Discord), nie wysyła wcale do kanałów
                        if (
                            glist.text.includes("discord.gg") ||
                            glist.text.includes("disboard.com")
                        ) {
                            listenerLog(
                                3,
                                "❌ Ta osoba użyła niedozwolonego linku. Anulowanie rządania..."
                            )
                            msg.react(customEmoticons.denided)
                            timeLog(
                                "bota (pobieranie czasu)",
                                performance.now()
                            )
                            timeLog("kodu GC", performance.now() - startTime)
                            return
                        }

                        listenerLog(3, "🗨️ Wysyłanie do reszty kanałów...")

                        dataObject.forEach((lgchannel) => {
                            if (lgchannel == null) return

                            const gchannelID = lgchannel.split("/")[1]
                            const gguildID = lgchannel.split("/")[0]
                            const gguild = client.guilds.cache.get(gguildID)
                            if (typeof gguild == "undefined") {
                                listenerLog(
                                    4,
                                    `❌ Nie znaleziono serwera ${gguildID}. Usuwam z bazy danych...`
                                )
                                remove(
                                    ref(
                                        getDatabase(firebaseApp),
                                        `globalchat/channels/${gguildID}`
                                    )
                                ).then(() => {
                                    listenerLog(
                                        4,
                                        `💾 Baza danych została zaktualizowana (globalchat/channels); usunięto lokalizację ${lgchannel}`
                                    )
                                })
                                return
                            }
                            gguild.channels
                                .fetch(gchannelID)
                                .then((gchannel) => {
                                    if (gchannel == null) {
                                        listenerLog(
                                            4,
                                            `❌ Nie znaleziono kanału ${gchannelID} na serwerze ${gguild.name.toUpperCase()} (${gguildID}). Usuwam z bazy danych...`
                                        )
                                        remove(
                                            ref(
                                                getDatabase(firebaseApp),
                                                `globalchat/channels/${gguildID}`
                                            )
                                        ).then(() => {
                                            listenerLog(
                                                4,
                                                `💾 Baza danych została zaktualizowana (globalchat/channels); usunięto lokalizację ${lgchannel}`
                                            )
                                        })
                                        return
                                    }
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
                                                        `🌐 Wysłano wiadomość za pomocą Webhooka na serwerze ${gguild.name.toUpperCase()}`
                                                    )
                                                    listenerLog(
                                                        5,
                                                        `📌 Lokalizacja: ${lgchannel}`
                                                    )
                                                    timeLog(
                                                        "bota (pobieranie czasu)",
                                                        performance.now()
                                                    )
                                                    timeLog(
                                                        "kodu GC",
                                                        performance.now() -
                                                            startTime
                                                    )
                                                })
                                        })
                                })
                        })
                    })
                } else {
                    listenerLog(
                        4,
                        "❌ Ten kanał nie znajduje się w bazie danych! Odrzucanie..."
                    )
                    timeLog("bota (pobieranie czasu)", performance.now())
                    timeLog("kodu GC", performance.now() - startTime)
                }
            }
        )
    }
})

client.on("interactionCreate", (int) => {
    listenerLog(2, "")
    listenerLog(2, "🎚️ Wyłapano interakcję!")
    listenerLog(3, `👤 ${int.user.username} (${int.user.id})`)
    listenerLog(
        3,
        `📌 ${int.guildId == null ? "DM" : int.guildId}/${int.channelId}`
    )
    if (int.isCommand()) {
        var fullname = [
            int.commandName,
            int.options._group,
            int.options._subcommand,
        ]
        fullname = fullname.filter((prop) => prop != null)

        listenerLog(4, "🔎 Typ: Komenda")
        listenerLog(5, `[/] ${fullname.join(" ")}`)
        listenerLog(5, `🖇️ Argumenty: `)

        if (int.options._hoistedOptions.length)
            int.options._hoistedOptions.forEach((arg) => {
                listenerLog(6, `📎 ${arg.name}`)
                listenerLog(7, `🖊️ ${arg.value}`)
                listenerLog(7, `[#] ${arg.type}`)
            })
        else {
            listenerLog(6, `❌ Brak`)
        }
        //console.log(int.options)
        const file = require(`./cmds/${fullname.join(".")}`)
        file.execute(client, int)
    }
    timeLog("bota (pobieranie czasu)", performance.now())
})

client.on("threadUpdate", (thread) => {
    if (thread.guildId == supportServer.id)
        setTimeout(() => {
            var accThread = client.channels.cache.get(thread.id)
            const accTags = accThread.appliedTags
            const accNames = Object.entries(accThread.parent.availableTags)
                .filter(([key, value]) => accTags.includes(value.id))
                .map(([key, value]) => value.name)
            const oldTags = thread.appliedTags
            const oldNames = Object.entries(thread.parent.availableTags)
                .filter(([key, value]) => oldTags.includes(value.id))
                .map(([key, value]) => value.name)

            if (
                typeof accThread == "undefined" &&
                thread.parent.type != ChannelType.GuildForum
            )
                return

            if (
                !oldNames.includes("Zamknięte") &&
                accNames.includes("Zamknięte")
            ) {
                var embed = new EmbedBuilder()
                    .setTitle("🔒 Zamykanie wątku")
                    .setDescription(
                        "Do tego wątku dodano tag **Zamknięte**. Kanał został zaarchiwizowany i zamknięty."
                    )
                    .setColor("DarkGold")

                thread.send({
                    embeds: [embed],
                })

                thread.setLocked().then(() =>
                    thread.setArchived().then(() => {
                        listenerLog(2, "")
                        listenerLog(
                            2,
                            `🔒 Dodano do kanału ${thread.id} ("${thread.name}") tag "Zamknięty"`
                        )
                        timeLog("bota (pobieranie czasu)", performance.now())
                    })
                )
            }
        }, 500)
})

client.login(TOKEN)
