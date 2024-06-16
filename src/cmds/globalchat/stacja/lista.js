const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db } = require("../../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        var stations = Object.entries(db.get("stations").val ?? {})
            .sort(() => Math.random() - 0.5)
            .filter((x, i) => i < 15)
        const embed = new EmbedBuilder()
            .setTitle("Lista stacji w losowej kolejności")
            .setDescription(
                `Wyświetlane jest maks. 15 stacji\n\n${stations.map((x) => `\`${x[0]}\` (<@${x[1].split("|")[0]}>, ${x[1].split("|")[1] ? "Na hasło" : "Publiczny"})`).join("\n")}`
            )
            .setColor("Random")

        interaction.editReply({
            embeds: [embed],
        })
    },
}
