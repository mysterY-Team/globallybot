const { CommandInteraction, Client } = require("discord.js")
const { customEmoticons } = require("../../../config")
const { wait } = require("../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute(client, interaction) {
        var amount = interaction.options.get("ilość", true).value

        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            interaction.reply("Niestety nie posiadasz permisji")
            return
        }

        await interaction.deferReply()
        var messages = await interaction.channel.bulkDelete(amount)
        interaction.reply(`${customEmoticons.approved} Udało się usunąć ${messages.size} wiadomości`)
        await wait(5000)
        interaction.deleteReply()
    },
}
