const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require("discord.js")
const { TOKEN, supportServers, debug, customEmoticons } = require("./config.js")
const { performance } = require("perf_hooks")
const { globalchatFunction } = require("./globalchat.js")
const { listenerLog, servers } = require("./functions/useful.js")
const { GlobalFonts } = require("@napi-rs/canvas")

var active = false

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration],
})

listenerLog(0, "Discord.js v.14", true)

GlobalFonts.registerFromPath("./src/others/novasq.ttf", "Nova Square")
GlobalFonts.registerFromPath("./src/others/jersey10.ttf", "Jersey 10")
GlobalFonts.registerFromPath("./src/others/notoemoji.ttf", "Noto Emoji")
GlobalFonts.registerFromPath("./src/others/audiowide.ttf", "Audiowide")

client.on("ready", (log) => {
    active = true
    listenerLog(0, `✅ Zalogowany poprawnie jako ${log.user.username}#${log.user.discriminator}`, true)
    listenerLog(1, `[+] Dodawanie komend...`)
    client.setMaxListeners(20)

    listenerLog(1, "👂 Nasłuchiwanie akcji bota...")

    client.user.setStatus(debug ? "dnd" : "online")
    timerToResetTheAPIInfo()
})

client.on("messageCreate", (msg) => {
    listenerLog(2, "")
    listenerLog(2, "❗ Wyłapano wiadomość!")

    try {
        var glist = {
            text: msg.content,
            msgID: msg.id,
            author: {
                id: msg.author.id,
                name: msg.author.discriminator == "0" ? msg.author.username : `${msg.author.username}#${msg.author.discriminator}`,
                isUser: !msg.author.bot && !msg.author.system,
                avatar: msg.author.displayAvatarURL({
                    extension: "webp",
                    forceStatic: false,
                }),
            },
            location: `${msg.guildId}/${msg.channelId}`,
            files: msg.attachments
                .filter((a) => a.contentType !== null && (a.contentType.startsWith("image") || a.contentType.startsWith("video") || a.contentType.startsWith("audio")))
                .map((a) => a.url),
        }

        globalchatFunction(client, msg, glist)
    } catch (err) {
        msg.reply(
            `${customEmoticons.denided} Nie mogłem przetworzyć Twojego rządania! Natrafiłeś na bardzo ciekawy błąd ze strony trzeciej (API Discorda). Spróbuj wysłać jeszcze raz, w razie czego zastanów się nad zmniejszeniem kontentu`
        )
        if (debug) console.warn(err)
    }
})

client.on("interactionCreate", async (int) => {
    listenerLog(2, "")
    listenerLog(2, "❗ Wyłapano interakcję")
    if (int.isCommand()) {
        listenerLog(3, "Jest komendą")
        var fullname = [int.commandName, int.options._group, int.options._subcommand]
        fullname = fullname.filter((prop) => prop != null)

        listenerLog(3, `⚙️ Uruchamianie pliku ${fullname.join("/")}.js`)
        //console.log(int.options)
        const file = require(`./cmds/${fullname.join("/")}`)
        file.execute(client, int)
    } else if (int.isMessageComponent()) {
        listenerLog(3, "Jest przyciskiem")
        var args = int.customId.split("\u0000")
        const cmd = args[0]
        args = args.filter((x, i) => i !== 0)

        listenerLog(3, `⚙️ Uruchamianie pliku ${cmd}.js`)
        //console.log(int.options)
        const file = require(`./btns/${cmd}`)
        file.execute(client, int, ...args)
    } else if (int.isAutocomplete()) {
        listenerLog(3, "Jest uzupełnianiem dla komendy")

        var fullname = [int.commandName, int.options._group, int.options._subcommand]
        fullname = fullname.filter((prop) => prop != null)

        listenerLog(3, `⚙️ Uruchamianie pliku ${fullname.join("/")}.js`)
        const file = require(`./cmds/${fullname.join("/")}`)

        const choices = file.autocomplete(int.options.getFocused(true), client)
        await int.respond(choices.map((choice) => ({ name: choice, value: choice })))
    } else if (int.isModalSubmit()) {
        listenerLog(3, "Został wywołany za pomocą formularza")
        var args = int.customId.split("\u0000")
        const cmd = args[0]
        args = args.filter((x, i) => i !== 0)

        listenerLog(3, `⚙️ Uruchamianie pliku ${cmd}.js`)
        //console.log(int.options)
        const file = require(`./modals/${cmd}`)
        file.execute(client, int, ...args)
    }
})

client.on("threadUpdate", (thread) => {
    listenerLog(2, "")
    listenerLog(2, "❗ Wyłapano aktualizację wątku")
    if (supportServers.includes(thread.guildId))
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

client.on("debug", (info) => {
    if (debug) listenerLog(2 * active, "[D] " + info)
})
client.on("warn", (err) => {
    if (debug) console.warn(err)
})
client.on("error", (err) => {
    if (debug) console.error(err)
})

client.login(TOKEN)

function timerToResetTheAPIInfo() {
    const slashCommandList = require(`./slashcommands.js`)
    client.application.commands.set(slashCommandList.list).then(() => {
        listenerLog(2, "")
        listenerLog(2, "✅ Zresetowano komendy do stanu pierworodnego!")
    })

    servers.fetch(client).then((x) => {
        listenerLog(2, "")
        listenerLog(2, "✅ Zapisano serwery na lokalnej zmiennej. Liczba oznaczająca zmianę: " + x)
    })

    setTimeout(() => {
        listenerLog(2, "")
        listenerLog(2, "❗Czas 30 minut!")
        timerToResetTheAPIInfo()
    }, 1800000)
}

module.exports = {
    codeTime: () => {
        return performance.now()
    },
}
