import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
import conf from "../../../../config.js"
const { db } = conf

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        var guilds = Object.values((await db.aget("serverData")).val)
            .filter((x) => "gc" in x)
            .map((x) => x.gc)
        //console.log(guilds.length)
        var stations = Object.entries((await db.aget("stations")).val ?? {})
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
