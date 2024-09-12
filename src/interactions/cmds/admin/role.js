const { CommandInteraction, EmbedBuilder, Client } = require("discord.js")

module.exports = {
    /**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

    async execute(client, interaction) {

        if (!(await interaction.guild.members.fetchMe()).permissions.has("Administrator")) {
            interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.info} Ta, jak i inne komendy z kategorii \`admin\` wymagają od bota posiadania permisji "Administrator".`,
            })
        }
        
    }
}