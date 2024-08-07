const { CommandInteraction, Client } = require("discord.js")
const { customEmoticons } = require("../../../config")

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
        
        var messages = await interaction.channel.bulkDelete(amount)
        interaction.reply(`${customEmoticons.approved} Udało się usunąć ${messages.size} wiadomości`) 
    }
}