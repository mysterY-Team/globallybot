const { CommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {  

        /**
         *
         * @param {CommandInteraction} interaction
        */
       async execute (interaction) {
                const user = interaction.options.getUser("user", false)|| interaction.user;
                const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 2048 });
                const avatarEmbed = new EmbedBuilder()
                .setTitle("Avatar")
                .setDescription(`[Download](${avatarUrl})`) 
                .setColor("#58D68D") 
                .setImage(avatarUrl)
                .setFooter({ text: `Globally, powered by "mysterY Devs" team`,  iconURL: "https://cdn.discordapp.com/avatars/1228622088047431772/201499823222ecca6482c9e71cac13e6.webp" });
                await interaction.reply({ embeds: [avatarEmbed] })
            
        },
};
