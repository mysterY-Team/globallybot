const djs = require("discord.js")
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
var conf = require("../../../config")
const { checkUserStatus } = require("../../../functions/useful")
const { customEmoticons } = conf

delete conf.TOKEN
delete conf.othertokens

module.exports = {
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

                    if (values.length === 1) consoled.push(value)
                    else {
                        if (i === 0) consoled.push("┏ " + value)
                        else if (i === values.length - 1) consoled.push("┗ " + value)
                        else consoled.push("┣ " + value)
                    }
                })
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
