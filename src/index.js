const { Client, GatewayIntentBits, EmbedBuilder, ChannelType } = require("discord.js")
const { TOKEN, supportServer, debug, customEmoticons, db } = require("./config.js")
const { performance } = require("perf_hooks")
const { globalchatFunction } = require("./globalchat.js")
const { listenerLog, servers } = require("./functions/useful.js")
const { GlobalFonts } = require("@napi-rs/canvas")
const { gcdata } = require("./functions/dbs.js")

var active = false

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration],
})

listenerLog(0, "Discord.js v.14", true)

GlobalFonts.registerFromPath("./src/others/fonts/outfit.ttf", "sans-serif")

GlobalFonts.registerFromPath("./src/others/fonts/novasq.ttf", "Nova Square")
GlobalFonts.registerFromPath("./src/others/fonts/jersey10.ttf", "Jersey 10")
GlobalFonts.registerFromPath("./src/others/fonts/audiowide.ttf", "Audiowide")
GlobalFonts.registerFromPath("./src/others/fonts/spacemono.ttf", "Space Mono")
GlobalFonts.registerFromPath("./src/others/fonts/galiver.ttf", "Galiver Sans")
GlobalFonts.registerFromPath("./src/others/fonts/scpro.ttf", "Source Code Pro")
GlobalFonts.registerFromPath("./src/others/fonts/kodemono.ttf", "Kode Mono")

GlobalFonts.registerFromPath("./src/others/efonts/notoemoji.ttf", "Noto Emoji")
GlobalFonts.registerFromPath("./src/others/efonts/firefoxemoji.ttf", "Firefox Emoji")
GlobalFonts.registerFromPath("./src/others/efonts/docomoji.ttf", "DoCoMo Emoji")

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
    globalchatFunction(client, msg)
})

client.on("interactionCreate", async (int) => {
    const errorEmbed = new EmbedBuilder()
        .setDescription("# Whoops!\nNastąpił błąd interacji. Posiadamy jednak dane, więc postaramy się ten błąd naprawić jak najszybciej!")
        .setFooter({ text: "Globally, powered by mysterY Team" })

    listenerLog(2, "")
    listenerLog(2, "❗ Wyłapano interakcję")
    if (int.isChatInputCommand()) {
        listenerLog(3, "Jest komendą (slash cmd)")
        var fullname = [int.commandName, int.options._group, int.options._subcommand]
        fullname = fullname.filter((prop) => prop != null)

        listenerLog(3, `⚙️ Uruchamianie pliku ${fullname.join("/")}.js`)
        //console.log(int.options)
        const file = require(`./interactions/cmds/${fullname.join("/")}`)
        file.execute(client, int).catch((err) => {
            console.error(err)
            if (int.replied || int.deferred) {
                int.editReply({
                    content: "",
                    components: [],
                    files: [],
                    embeds: [errorEmbed],
                })
            } else {
                int.reply({ embeds: [errorEmbed], ephemeral: true })
            }
        })
    } else if (int.isButton()) {
        listenerLog(3, "Jest przyciskiem")
        var args = int.customId.split("\u0000")
        const cmd = args[0]
        args = args.filter((x, i) => i !== 0)

        listenerLog(3, `⚙️ Uruchamianie pliku ${cmd}.js`)
        //console.log(int.options)
        const file = require(`./interactions/components/btns/${cmd}`)
        file.execute(client, int, ...args).catch((err) => {
            console.error(err)
            if (int.deferred || int.replied) {
                try {
                    int.editReply({ content: "", components: [], files: [], embeds: [errorEmbed] })
                } catch (e) {
                    int.update({ content: "", components: [], files: [], embeds: [errorEmbed] })
                }
            } else {
                int.reply({ embeds: [errorEmbed] })
            }
        })
    } else if (int.isAutocomplete()) {
        listenerLog(3, "Jest uzupełnianiem dla komendy")

        var fullname = [int.commandName, int.options._group, int.options._subcommand]
        fullname = fullname.filter((prop) => prop != null)

        listenerLog(3, `⚙️ Uruchamianie pliku ${fullname.join("/")}.js`)
        const file = require(`./interactions/cmds/${fullname.join("/")}`)

        const choices = file.autocomplete(int.options.getFocused(true), client)
        await int.respond(choices.map((choice) => (typeof choice === "object" ? choice : { name: choice, value: choice })))
    } else if (int.isModalSubmit()) {
        listenerLog(3, "Został wywołany za pomocą formularza")
        var args = int.customId.split("\u0000")
        const cmd = args[0]
        args = args.filter((x, i) => i !== 0)

        listenerLog(3, `⚙️ Uruchamianie pliku ${cmd}.js`)
        //console.log(int.options)
        const file = require(`./interactions/modals/${cmd}`)
        file.execute(client, int, ...args).catch((err) => {
            console.error(err)
            if (int.replied || int.deferred) {
                int.editReply({
                    content: "",
                    components: [],
                    files: [],
                    embeds: [errorEmbed],
                })
            } else {
                int.reply({ embeds: [errorEmbed], ephemeral: true })
            }
        })
    } else if (int.isContextMenuCommand()) {
        listenerLog(3, "Jest komendą (kontekstowe menu)")
        var filename = int.commandName.toLowerCase().replace(/ /g, "_")
        listenerLog(3, `⚙️ Uruchamianie pliku ${filename}.js`)
        const file = require(`./interactions/contextMenus/${filename}`)

        file.execute(client, int).catch((err) => {
            if (int.replied || int.deferred) {
                int.editReply({
                    content: "",
                    components: [],
                    files: [],
                    embeds: [errorEmbed],
                })
            } else {
                int.reply({ embeds: [errorEmbed], ephemeral: true })
            }
            console.error(err)
        })
    }
})

client.on("threadUpdate", (thread) => {
    listenerLog(2, "")
    listenerLog(2, "❗ Wyłapano aktualizację wątku")
    if (thread.guildId === supportServer.id)
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
client.on("guildCreate", async (guild) => {
    listenerLog(3, `Nowy serwer: ${guild.name}`)
    const embed = new EmbedBuilder()
        .setAuthor({ iconURL: guild.iconURL({ extension: "webp", size: 32 }), name: "Nowy serwer" })
        .setDescription(`ID serwera: \`${guild.id}\`\n\`Nazwa serwera: \`${guild.name}\`\nWłaściciel: <@${guild.ownerId}> (\`${guild.ownerId}\`)`)
        .setColor("Green")
    await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send(embed)
})

client.on("debug", (info) => {
    if (debug) {
        if (active) listenerLog(2, "")
        listenerLog(2 * active, "[D] " + info)
    }
})
client.on("warn", (err) => {
    if (debug) console.warn(err)
})
client.on("error", (err) => {
    if (debug) console.error(err)
})

client.login(TOKEN)

function timerToResetTheAPIInfo() {
    async function x() {
        listenerLog(2, "")

        const slashCommandList = require(`./slashcommands.js`)
        await client.application.commands.set(slashCommandList.list())
        listenerLog(2, "✅ Zresetowano komendy do stanu pierworodnego!")

        var y = await servers.fetch(client)
        listenerLog(2, "✅ Zapisano serwery na lokalnej zmiennej. Liczba oznaczająca zmianę: " + y)

        if (new Date().getHours() == 0) {
            var index = Object.entries(db.get("userData").val ?? {})
                .filter((x) => x[1].gc)
                .map((x) => Object.assign(gcdata.encode(x[1].gc), { userID: x[0] }))
            listenerLog(2 * debug, "🔎 Sprawdzanie nieaktywnych użytkowników", true)
            index.forEach((x) => {
                if (x.karma < 25n && !x.isBlocked) {
                    db.delete(`userData/${x.userID}/gc`)
                    listenerLog(2 * debug + 1, "Usunięto użytkownika " + x.userID, true)
                }
            })
        }
    }
    x()
    setTimeout(() => {
        listenerLog(2, "")
        listenerLog(2, "❗Czas 60 minut!")
        timerToResetTheAPIInfo()
    }, 3_600_000)
}

module.exports = {
    codeTime: () => {
        return performance.now()
    },
}
