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

        if (!(await interaction.guild.members.fetchMe()).permissions.has("Administrator")) {
            interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.info} Ta, jak i inne komendy z kategorii \`admin\` wymagają od bota posiadania permisji "Administrator".`,
            })
        }

        await interaction.deferReply()
        var messages = await interaction.channel.bulkDelete(amount)
        interaction.reply(`${customEmoticons.approved} Udało się usunąć ${messages.size} wiadomości`)
        await wait(5000)
        interaction.deleteReply()
    },
}
