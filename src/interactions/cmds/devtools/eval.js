import djs from "discord.js"
import conf from "../../../config.js"
import * as useful from "../../../functions/useful.js"
import * as dbsys from "../../../functions/dbSystem.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
const { checkUserStatus } = useful
const { customEmoticons } = conf

export default {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        if (!isInMysteryTeam)
            return interaction.editReply({
                content: `${customEmoticons.denided} Nie jesteś właścicielem bota!`,
                ephemeral: true,
            })

        try {
            var thisGuild = interaction.guild
            var thisChannel = interaction.channel

            var consoled = []
            function writeToAkaConsole(...values) {
                values.forEach((value, i) => {
                    switch (typeof value) {
                        case "string":
                            break
                        case "function":
                        case "number":
                        case "bigint":
                        case "boolean":
                        case "symbol":
                            value = value.toString()
                            break
                        case "undefined":
                            value = "undefined"
                            break
                        case "object":
                            if (value === null) value = "null"
                            else if (value instanceof Object || value instanceof Array) {
                                try {
                                    value = JSON.stringify(value)
                                } catch (e) {
                                    value = value.toString()
                                }
                            } else if (value.toString) value = value.toString()
                            else value = value.constructor?.toString() ?? "[object]"
                    }

                    value = value.split(conf.TOKEN).join(conf.TOKEN.slice(0, 3) + "*".repeat(conf.TOKEN.length - 3))
                    value = value.split(conf.othertokens.gemini).join(conf.othertokens.gemini.slice(0, 3) + "*".repeat(conf.othertokens.gemini.length - 3))
                    value = value.split(conf.othertokens.stable_diff).join(conf.othertokens.stable_diff.slice(0, 3) + "*".repeat(conf.othertokens.stable_diff.length - 3))

                    if (values.length === 1) consoled.push(value)
                    else {
                        if (i === 0) consoled.push("┏ " + value.split("\n").join("\n┃ "))
                        else if (i === values.length - 1) consoled.push("┗ " + value.split("\n").join("\n  "))
                        else consoled.push("┣ " + value.split("\n").join("\n┃ "))
                    }
                })
            }

            /**
             * @param {string} uid
             * @param {string} time
             */
            const setSAT = async (uid, time, force = false) => {
                const snapshot = await conf.db.aget(`userData/${uid}/gc`)
                if (!snapshot.exists && !force) return writeToAkaConsole("Nie ustawiono SAT, bowiem użytkownik taki nie istnieje")
                const gc = dbsys.gcdata.encode(snapshot.val ?? "")
                gc._sat =
                    (() => {
                        time = time.toLowerCase()
                        if (time.endsWith("h")) return Number(time.replace("h", "")) * 3600000
                        if (time.endsWith("d")) return Number(time.replace("d", "")) * 86400000
                        if (time.endsWith("w")) return Number(time.replace("w", "")) * 604800000
                        if (time.endsWith("m")) return Number(time.replace("m", "")) * 2592000000
                        return Number(time)
                    })() + Date.now()
                await conf.db.aset(`userData/${uid}/gc`, dbsys.gcdata.decode(gc))
                writeToAkaConsole(`Ustawiono SAT poprawnie! SAT: ${gc._sat}`)
            }

            const GlobalChatEvalFunc = {
                /**
                 * @param {string} string
                 * @param {"gcmessage" | "rawloc"} type
                 * @returns
                 */
                delete: async (string, type = "gcmessage") => {
                    var loc = [""]
                    if (type == "gcmessage") loc = (await (await client.channels.fetch(supportServer.gclogs.msg))?.messages.fetch(string))?.content.split("|") || string.split("|")
                    else if (type == "rawloc") loc = string.split("|")
                    else return writeToAkaConsole("Nieprawidłowy typ!")

                    const x = await Promise.all(
                        loc.map(async (location, i) => {
                            location = location.split("/")

                            try {
                                const server = await client.guilds.fetch(location[0])
                                const channel = await server.channels.fetch(location[1])
                                if (channel && channel.type === ChannelType.GuildText) {
                                    const message = await channel.messages.fetch(location[2])
                                    if (message?.deletable) {
                                        await message.delete()
                                    }
                                }
                                return true
                            } catch (e) {
                                return false
                            }
                        })
                    )

                    writeToAkaConsole(`Usunięto ${x.filter((x) => x).length} wiadomości z ${x.length}!`)
                },
            }

            var func = async function () {}
            eval(`func = async function() { ${interaction.options.get("func", true).value.replace(/console\.log\(/g, "writeToAkaConsole(")} }`)
            await func()

            var x = new EmbedBuilder()
                .setColor("Green")
                .setTitle(`${customEmoticons.approved} \`/eval\` wykonany poprawnie!`)
                .addFields(
                    {
                        name: "Kod",
                        value: `\`\`\`javascript\n${interaction.options.get("func", true).value.replace(/;/g, "\n")}\n\`\`\``,
                    },
                    {
                        name: "Konsola",
                        value:
                            consoled.length > 0
                                ? `\`\`\`\n${consoled
                                      .map((val) => {
                                          if (typeof val == "object") val = JSON.stringify(val)
                                          return val
                                      })
                                      .join("\n")}\n\`\`\``
                                : customEmoticons.denided,
                    }
                )
            interaction.editReply({
                embeds: [x],
            })
        } catch (error) {
            var x = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`${customEmoticons.approved} \`/eval\` zwrócił błąd!`)
                .setDescription(`\`\`\`${error}\`\`\``)
                .addFields({
                    name: "Kod",
                    value: `\`\`\`javascript\n${interaction.options
                        .get("func", true)
                        .value.split(";")
                        .map((y) => y.trim())
                        .join("\n")}\n\`\`\``,
                })
            interaction.editReply({
                embeds: [x],
            })
        }
    },
}
