const { CommandInteraction, EmbedBuilder, Client, RoleManager } = require("discord.js")

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
        var nazwa = interaction.options.get("nazwa", true).value;
        var kolor = interaction.options.get("kolor")?.value;
        var ikona = interaction.options.get("ikona")?.value;
        
        var poprawnie = new EmbedBuilder().setDescription("Rola " + nazwa + " została stworzona poprawnie.").setColor("Green")

        interaction.guild.roles.create({
            name: nazwa,
            color: kolor,
            icon: ikona
        })
        interaction.reply({embeds: [poprawnie]})
        }
}