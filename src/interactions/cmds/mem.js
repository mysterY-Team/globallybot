import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
import conf from "../../config.js"
const { customEmoticons } = conf

export default {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    execute: async function (client, interaction) {
        await interaction.deferReply()
        try {
            var x = await request("http://srv27.mikr.us:30105/memhubapi/randomimg")
            x = await x.body.json()
            const file = x.image

            interaction.editReply({
                embeds: [new EmbedBuilder().setImage(file).setColor("Random").setFooter({ text: "Źródło: Memhub (repo patYczakus/Memhub-API-filesystem)" })],
            })
        } catch (error) {
            interaction.editReply({
                content: `${customEmoticons.denided} Nie udało się pobrać mema`,
            })
            throw console.error(error)
        }
    },
}
