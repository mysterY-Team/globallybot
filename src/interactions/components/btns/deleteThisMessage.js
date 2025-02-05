import djs from "discord.js"
const { Client, ButtonInteraction, ButtonBuilder } = djs

export default {
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferUpdate()
        await interaction.deleteReply()
    },
}
