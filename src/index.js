const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require("discord.js")
const { TOKEN, supportServer, firebaseApp } = require("./config.js")
const { performance } = require("perf_hooks")
const { globalchatFunction } = require("./globalchat.js")
const { get, set, getDatabase, ref } = require("@firebase/database")

const debug = false

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
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

listenerLog(0, "Discord.js v.14", true)

client.on("ready", (log) => {
    listenerLog(0, `✅ Zalogowany poprawnie jako ${log.user.username}#${log.user.discriminator}`, true)
    listenerLog(1, `[+] Dodawanie komend...`)
    client.setMaxListeners(15)

    const slashCommandList = require(`./slashcommands.js`)
    client.application.commands.set(slashCommandList.list).then(() => {
        listenerLog(1, "✅ Ustawiono pomyślnie komendy!")
        listenerLog(1, "👂 Nasłuchiwanie akcji bota...")
    })
    get(ref(getDatabase(firebaseApp), "globalchat/gpt")).then((snpsht) => {
        var data = snpsht.val()
        if (!snpsht.exists() || new Date().getUTCDate() != data.uses.day)
            set(ref(getDatabase(firebaseApp), "globalchat/gpt"), {
                uses: {
                    day: new Date().getUTCDate(),
                    i: 0,
                },
                messages: [],
            })
    })
    timerToResetTheAPIInfo()
})

client.on("messageCreate", (msg) => {
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
    if (int.isCommand()) {
        var fullname = [int.commandName, int.options._group, int.options._subcommand]
        fullname = fullname.filter((prop) => prop != null)

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
        listenerLog(1, `🕰️ Minęło pół godziny od resetu API`)
        var date = new Date()
        if (date.getUTCHours() == 0) {
            //pobieranie bazy danych
            get(ref(getDatabase(firebaseApp), "globalchat/gpt")).then((snpsht) => {
                var data = snpsht.val()
                if (date.getUTCDate() < data.uses.day) {
                    //zapis w bazie danych
                    set(ref(getDatabase(firebaseApp), "globalchat/gpt"), {
                        uses: {
                            day: date.getUTCDate(),
                            i: 0,
                        },
                        messages: [],
                    })
                }
            })
        }
        timerToResetTheAPIInfo()
    }, 1800000)
}

module.exports = {
    codeTime: performance.now,
}
