import djs from "discord.js"
const { Client, ButtonInteraction, ButtonBuilder } = djs

export default {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferUpdate()
        await interaction.deleteReply()
    },
}
