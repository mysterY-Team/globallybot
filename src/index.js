const { Client, EmbedBuilder, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle, Partials } = require("discord.js")
const { TOKEN, supportServer, debug, db, _bot } = require("./config.js")
const { performance } = require("perf_hooks")
const { globalchatFunction } = require("./globalchat.js")
const { listenerLog, servers, checkUserStatus, botPremiumInfo, repeats } = require("./functions/useful.js")
const { GlobalFonts } = require("@napi-rs/canvas")
const { gcdata } = require("./functions/dbSystem.js")
var active = false
var forceUpdate = true

const client = new Client({
    partials: [Partials.Message, Partials.User],
    intents: ["Guilds", "MessageContent", "GuildMessages", "MessageContent", "GuildMembers", "GuildModeration"],
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

client.on("messageCreate", async (msg) => {
    let fullmsg = msg
    if (msg.partial) {
        fullmsg = await msg.fetch()
    }
    globalchatFunction(client, fullmsg)
})

client.on("interactionCreate", async (int) => {
    const errorEmbed = new EmbedBuilder()
        .setDescription("# Whoops!\nNastąpił błąd interacji. Posiadamy jednak dane, więc postaramy się ten błąd naprawić jak najszybciej!")
        .setFooter({ text: "Globally, powered by mysterY" })

    listenerLog(2, "")
    listenerLog(2, "❗ Wyłapano interakcję")

    if (int.isChatInputCommand()) {
        var customPaths = {
            "4fun": {
                czynność: "4fun/uczucia",
                reakcja: "4fun/uczucia",
            },
        }
        listenerLog(3, "Jest komendą (slash cmd)")
        listenerLog(4, "Typ kontekstu: " + ["nieznany", "serwer", "DM bota", "kanał o ograniczonym dostępie"][(int.context ?? -1) + 1])
        var fullname = [int.commandName, int.options._group, int.options._subcommand]
        fullname = fullname.filter((prop) => prop != null)

        var path = fullname.join("/")
        if (typeof customPaths[fullname[0]] === "string") path = customPaths[fullname[0]]
        else if (fullname.length >= 2 && typeof customPaths[fullname[0]]?.[fullname[1]] === "string") path = customPaths[fullname[0]][fullname[1]]
        else if (fullname.length == 3 && customPaths[fullname[0]]?.[fullname[1]]?.[fullname[2]]) path = customPaths[fullname[0]][fullname[1]][fullname[2]]

        listenerLog(3, `⚙️ Uruchamianie pliku ${path}.js`)
        //console.log(int.options)
        const file = require(`./interactions/cmds/${path}`)
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

client.on("threadUpdate", (oldThread, newThread) => {
    listenerLog(2, "")
    listenerLog(2, "❗ Wyłapano aktualizację wątku")
    if (newThread.guildId === supportServer.id) {
        if (newThread.parent.type != ChannelType.GuildForum) return

        const newTags = newThread.appliedTags
        const newNames = Object.entries(newThread.parent.availableTags ?? {})
            .filter(([key, value]) => newTags.includes(value.id))
            .map(([key, value]) => value.name)
        const oldTags = oldThread.appliedTags
        const oldNames = Object.entries(oldThread.parent.availableTags ?? {})
            .filter(([key, value]) => oldTags.includes(value.id))
            .map(([key, value]) => value.name)

        if (!oldNames.includes("Zamknięte") && newNames.includes("Zamknięte")) {
            var embed = new EmbedBuilder()
                .setTitle("🔒 Zamykanie wątku")
                .setDescription("Do tego wątku dodano tag **Zamknięte**. Kanał został zaarchiwizowany i zamknięty.")
                .setColor("DarkGold")

            newThread.send({
                embeds: [embed],
            })

            newThread.setLocked().then(() => newThread.setArchived())
        }
    }
})

client.on("debug", (info) => {
    if (debug) {
        if (!active) {
            listenerLog(0, "[D] " + info)
        }
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
        var y = await servers.fetch(client)
        listenerLog(2, "")
        listenerLog(2, "✅ Zapisano serwery na lokalnej zmiennej. Liczba oznaczająca zmianę: " + y)

        let users = Object.entries(db.get("userData").val ?? {})

        var listOfUsers = {
            gc: users.filter((x) => x[1].gc).map((x) => Object.assign(gcdata.encode(x[1].gc), { userID: x[0] })),
            premium: users
                .filter((x) => {
                    // console.log((x[1].premium ?? "OK") != "OK")
                    return (x[1].premium ?? "OK") != "OK"
                })
                .map((x) => {
                    return { userID: x[0], days: x[1].premium }
                }),
        }

        var stations = Object.entries(db.get("stations").val).map((x) => {
            // console.log(x)
            x[1] = x[1].split("|")
            return { id: x[0], ownerID: x[1][0], passwd: Boolean(x[1][1]), mods: (x[1][2] ?? "").split(",") }
        })
        var stationOwners = Object.keys(repeats(...stations.map((x) => x.ownerID)))

        delete users

        let date = new Date()
        if (date.getHours() === 0 || forceUpdate) {
            forceUpdate = false

            const slashCommandList = require(`./slashcommands.js`)
            await client.application.commands.set(slashCommandList.list())
            listenerLog(2, "✅ Zresetowano komendy do stanu pierworodnego!")

            listenerLog(2 * debug, "🔎 Sprawdzanie nieaktywnych użytkowników", true)
            listOfUsers.gc.forEach((x) => {
                if (Math.max(x.timestampToSendMessage, x._sat) + 864000000 <= Date.now() && !x.isBlocked) {
                    db.delete(`userData/${x.userID}/gc`)
                    listenerLog(2 * debug + 1, "Usunięto użytkownika " + x.userID, true)
                }
            })

            if (date.getHours() === 0 || debug)
                listOfUsers.premium.forEach(async (x) => {
                    //console.log(x, x.days)
                    if (x.days == 0) return db.adelete(`userData/${x.userID}/premium`)
                    const premium = botPremiumInfo(x.userID, await checkUserStatus(client, x.userID), x.days)
                    if (!premium.have || premium.typeof !== "trial") return
                    if (x.days == 1) {
                        db.adelete(`userData/${x.userID}/premium`)
                        try {
                            client.users.send(x.userID, {
                                content:
                                    "No cześć, mam złą wiadomość. Premium dobiegło końca! Może uda Ci się ponownie zdobyć w jakimś konkursie...\n-# Globally, powered by mysterY",
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId("deleteThisMessage").setLabel(`Usuń tą wiadomość dla mnie`)
                                    ),
                                ],
                            })
                        } catch (e) {}
                    } else {
                        db.aset(`userData/${x.userID}/premium`, x.days - 1)
                    }
                })

            listenerLog(2, "🔎 Sprawdzanie stacji po zakończonym premium")
            stationOwners.forEach(async (v) => {
                listenerLog(3, `Właściciel ${v}`)
                const ssstatus = await checkUserStatus(client, v)
                const premium = botPremiumInfo(v, ssstatus)
                if (premium.have || ssstatus.mysteryTeam) return listenerLog(4, "Posiada możliwość wielostacji, sprawdzanie następnego...")
                const allStationsByThatOwner = stations.filter((x) => x.ownerID == v)
                for (let i = 1; i < allStationsByThatOwner.length; i++) {
                    const element = allStationsByThatOwner[i]
                    db.delete(`stations/${element.id}`)
                    listenerLog(4, `🗑️ usunięto stację ${element.id}${element.passwd ? " (hasłowana)" : ""}`)
                }
            })
        }
        delete hours

        const usersToUB = listOfUsers.gc.filter((x) => x.isBlocked && x.blockTimestamp <= Math.round(Date.now() / 3_600_000))
        usersToUB.forEach((x) => {
            x.blockTimestamp = NaN
            x.blockReason = ""
            x.isBlocked = false
            const uID = x.userID
            delete x.userID
            db.set(`userData/${uID}/gc`, gcdata.decode(x))
            x.userID = uID
            try {
                client.users.send(uID, {
                    content: "Twoja czasowa blokada dobiegła końca! Możesz skorzystać z GlobalChat!\n-# Globally, powered by mysterY",
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId("deleteThisMessage").setLabel(`Usuń tą wiadomość dla mnie`)
                        ),
                    ],
                })
            } catch (e) {}
        })

        if (usersToUB.length > 0) {
            const emb = new EmbedBuilder()
                .setTitle("Zakończenie czasowej blokady!")
                .setDescription(`Osoby odblokowane (tylko ID):\n${usersToUB.map((x) => `- \`${x.userID}\``).join("\n")}`)
                .setColor("Blue")
            await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.blocks)).send({ embeds: [emb] })
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
