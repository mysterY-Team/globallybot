import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
import conf from "../../config.js"
const { customEmoticons } = conf
import { request } from "undici"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    execute: async function (client, interaction) {
        await interaction.deferReply()
        try {
            var x = await request("https://memapi.vercel.app/memhubapi/randomimg")
            const file = (await x.body.json()).image
            x.body.destroy()

            interaction.editReply({
                embeds: [new EmbedBuilder().setImage(file).setColor("Random").setFooter({ text: "Źródło: Memhub (repo patYczakus/Memhub-API-filesystem)" })],
            })
        } catch (error) {
            interaction.editReply({
                content: `${customEmoticons.denided} Nie udało się pobrać mema`,
            })
            throw console.warn(error)
        }
    },
}
