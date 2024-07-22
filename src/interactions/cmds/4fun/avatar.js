const { CommandInteraction, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const user = interaction.options.get("osoba")?.user || interaction.user

        const avatarUrl = user.displayAvatarURL({ size: 2048 })

        const avatarEmbed = new EmbedBuilder().setTitle("Avatar").setColor("Random").setImage(avatarUrl).setFooter({
            text: `Globally, powered by "mysterY Devs" team`,
        })
        const btns = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(avatarUrl).setLabel("Link do banneru"))

        await interaction.reply({ embeds: [avatarEmbed], components: [btns] })
    },
}
