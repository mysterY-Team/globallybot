const { CommandInteraction, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const user = interaction.options.get("osoba")?.user || interaction.user

        const bannerUrl = user.bannerURL({ size: 1024 })
        if (!bannerUrl) {
            await interaction.reply({ content: "Ten użytkownik nie posiada banneru", ephemeral: true })
            return
        }

        const bannerEmbed = new EmbedBuilder().setTitle("Banner").setColor("Random").setImage(bannerUrl).setFooter({
            text: `Globally, powered by mysterY Team`,
        })
        const btns = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(bannerUrl))

        await interaction.reply({ embeds: [bannerEmbed], components: [btns] })
    },
}
