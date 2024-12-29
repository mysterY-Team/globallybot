import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
import conf from "../../config.js"
const { customEmoticons } = conf
import { request } from "undici"

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
            const file = (await x.body.json()).image
            x.body.destroy()

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
