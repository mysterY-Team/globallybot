const { Client, ButtonInteraction, ButtonBuilder } = require("discord.js")

module.exports = {
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
