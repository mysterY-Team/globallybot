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
        var guilds = Object.values(db.get("serverData").val)
            .filter((x) => "gc" in x)
            .map((x) => x.gc)
        console.log(guilds.length)
        var stations = Object.entries(db.get("stations").val ?? {})
            .sort(() => Math.random() - 0.5)
            .map((x) => {
                return { sid: x[0], passwd: x[1].split("|")[1], uid: x[1].split("|")[0], serverCount: guilds.filter((y) => y.includes(x[0])).length }
            })
            .filter((x, i) => i < 25)

        const embed = new EmbedBuilder()
            .setTitle("Lista stacji w losowej kolejności")
            .setDescription(
                `Wyświetlane jest maks. 25 stacji\n\n${stations
                    .map((x) => `\`${x.sid}\` (<@${x.uid}>, ${x.passwd ? "Na hasło" : "Publiczny"}, \`${x.serverCount}/25\` serwerów)`)
                    .join("\n")}`
            )
            .setColor("Random")

        interaction.editReply({
            embeds: [embed],
        })
    },
}
