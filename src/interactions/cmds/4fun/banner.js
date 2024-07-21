const { CommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {  
    /**
     * @param {CommandInteraction} interaction
    */
    async execute(interaction) {
        const user = interaction.options.getUser("user", false) || interaction.user;

        const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });
        const bannerUrl = fetchedUser.bannerURL({ dynamic: true, size: 512});

        if (!bannerUrl) {
            await interaction.reply({ content: "Ten użytkownik nie posiada banneru", ephemeral: true });
            return;
        }

        const bannerEmbed = new EmbedBuilder()
            .setTitle("Banner")
            .setDescription(`[Download](${bannerUrl})`)
            .setColor("#58D68D")
            .setImage(bannerUrl)
            .setFooter({ text: `Globally, powered by "mysterY Devs" team`, iconURL: "https://cdn.discordapp.com/avatars/1228622088047431772/201499823222ecca6482c9e71cac13e6.webp" });

        await interaction.reply({ embeds: [bannerEmbed] });
    },
};
