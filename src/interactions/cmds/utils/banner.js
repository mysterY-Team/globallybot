const { ChatInputCommandInteraction, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const user = interaction.options.get("osoba")?.user || interaction.user
        const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });

        const bannerUrl = fetchedUser.bannerURL({ size: 512 })
        if (!bannerUrl) {
            await interaction.reply({ content: "Ten użytkownik nie posiada banneru", ephemeral: true })
            return
        }

        const bannerEmbed = new EmbedBuilder().setTitle("Banner").setColor("Random").setImage(bannerUrl).setFooter({
            text: `Globally, powered by mysterY`,
        })
        // const btns = new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(bannerUrl).setLabel("Link do banneru"))

        await interaction.reply({ embeds: [bannerEmbed] })
    },
}
a