const { Client, GatewayIntentBits, EmbedBuilder, ChannelType, ActivityType } = require("discord.js")
const { TOKEN, supportServer, firebaseApp } = require("./config.js")
const { performance } = require("perf_hooks")
const { globalchatFunction } = require("./globalchat.js")
const { get, set, getDatabase, ref, onValue } = require("@firebase/database")

const debug = false

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
})

function listenerLog(space, info, priority = false) {
    if (!debug && !priority) return

    var text = ""
    for (let index = 0; index < space; index++) {
        text += "|   "
    }
    text += info

    console.log(text)
}

listenerLog(0, "Discord.js v.14", true)

client.on("ready", (log) => {
    listenerLog(0, `✅ Zalogowany poprawnie jako ${log.user.username}#${log.user.discriminator}`, true)
    listenerLog(1, `[+] Dodawanie komend...`)
    client.setMaxListeners(20)

    const slashCommandList = require(`./slashcommands.js`)
    client.application.commands
        .set(slashCommandList.list)
        .then(() => {
            listenerLog(1, "")
            listenerLog(1, "✅ Ustawiono pomyślnie komendy!")
            listenerLog(1, "👂 Nasłuchiwanie akcji bota...")
        })
        .then(() => {
            var _date = new Date()

            set(ref(getDatabase(firebaseApp), "dateConstr"), {
                d: _date.getUTCDate(),
                m: _date.getUTCMonth(),
                y: _date.getUTCFullYear(),
            })
        })

    //
    onValue(ref(getDatabase(firebaseApp), "dateConstr/d"), (s) => {
        const _a = performance.now()
        listenerLog(1, "")
        listenerLog(1, `❗ Dostano informację o aktualizacji czasu!`)

        if (s.val() == new Date().getUTCDate()) return

        set(ref(getDatabase(firebaseApp), "globalchat/gpt"), {
            uses: 0,
            messages: [],
        }).then(() => {
            listenerLog(2, `✅ Zresetowano bazę danych "/globalchat/gpt" (czas: ${performance.now() - _a}ms)`)
        })
    })

    client.user.setStatus(debug ? "dnd" : "online")
    timerToResetTheAPIInfo()
})

client.on("messageCreate", (msg) => {
    listenerLog(1, "❗ Wyłapano wiadomość!")

    var glist = {
        text: msg.content,
        msgID: msg.id,
        author: {
            id: msg.author.id,
            name: msg.author.discriminator == "0" ? msg.author.username : `${msg.author.username}#${msg.author.discriminator}`,
            isUser: !msg.author.bot && !msg.author.system,
            avatar: msg.author.avatarURL({
                extension: "png",
            }),
        },
        location: `${msg.guildId}/${msg.channelId}`,
        files: msg.attachments.filter((a) => a.contentType.startsWith("image") || a.contentType.startsWith("video") || a.contentType.startsWith("audio")).map((a) => a.url),
    }

    globalchatFunction(client, msg, glist)
})

client.on("interactionCreate", (int) => {
    listenerLog(1, "❗ Wyłapano interakcję")
    if (int.isCommand()) {
        listenerLog(2, "Jest komendą")
        var fullname = [int.commandName, int.options._group, int.options._subcommand]
        fullname = fullname.filter((prop) => prop != null)

        listenerLog(2, `⚙️ Uruchamianie pliku ${fullname}.js`)
        //console.log(int.options)
        const file = require(`./cmds/${fullname.join(".")}`)
        file.execute(client, int)
    }
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

            if (typeof accThread == "undefined" && thread.parent.type != ChannelType.GuildForum) return

            if (!oldNames.includes("Zamknięte") && accNames.includes("Zamknięte")) {
                var embed = new EmbedBuilder()
                    .setTitle("🔒 Zamykanie wątku")
                    .setDescription("Do tego wątku dodano tag **Zamknięte**. Kanał został zaarchiwizowany i zamknięty.")
                    .setColor("DarkGold")

                thread.send({
                    embeds: [embed],
                })

                thread.setLocked().then(() => thread.setArchived())
            }
        }, 500)
})

client.login(TOKEN)

function timerToResetTheAPIInfo() {
    setTimeout(() => {
        var date = new Date()
        if (date.getUTCHours() == 0) {
            //pobieranie bazy danych
            set(ref(getDatabase(firebaseApp), "dateConstr"), {
                d: date.getUTCDate(),
                m: date.getUTCMonth(),
                y: date.getUTCFullYear(),
            })
        }
        timerToResetTheAPIInfo()
    }, 1800000)
}

module.exports = {
    codeTime: performance.now,
}
