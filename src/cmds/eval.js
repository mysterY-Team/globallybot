const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { customEmoticons, ownersID } = require("../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!ownersID.includes(interaction.user.id))
            return interaction.reply({
                content: `${customEmoticons.denided} Nie jesteś właścicielem bota!`,
                ephemeral: true,
            })

        interaction.deferReply().then(() => {
            try {
                var consoled = []
                eval(interaction.options.get("e", true).value.replace("console.log(", "consoled.push("))

                var x = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`${customEmoticons.approved} \`/eval\` wykonany poprawnie!`)
                    .addFields(
                        {
                            name: "Kod",
                            value: `\`\`\`javascript\n${interaction.options.get("e", true).value.replace(/;/g, "\n")}\n\`\`\``,
                        },
                        {
                            name: "Konsola",
                            value: `\`\`\`\n${consoled
                                .map((val) => {
                                    if (typeof val == "object") val = JSON.stringify(val)
                                    return val
                                })
                                .join("\n")}\n\`\`\``,
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
                        value: `\`\`\`javascript\n${interaction.options.get("e", true).value.replace(/;/g, "\n")}\n\`\`\``,
                    })
                interaction.editReply({
                    embeds: [x],
                })
            }
        })
    },
}
