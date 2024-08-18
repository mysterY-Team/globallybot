const { Client, CommandInteraction, PermissionsBitField } = require("discord.js");
const { customEmoticons } = require("../../../config");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute(client, interaction) {
        const osoba = interaction.options.getUser("osoba", true);

        if (interaction.user.id === osoba.id) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie możesz zbanować siebie.`, ephemeral: true });
        }

        const osobaDoZbanowania = interaction.guild.members.resolve(osoba);

        if (!osobaDoZbanowania) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie mogę znaleźć tej osoby na serwerze.`, ephemeral: true });
        }

        if (interaction.member.roles.highest.position <= osobaDoZbanowania.roles.highest.position && !interaction.guild.ownerId === interaction.member.id) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie możesz zbanować osoby wyższej od siebie.`, ephemeral: true });
        }


        if (!osobaDoZbanowania.bannable) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie mogę zbanować tej osoby.`, ephemeral: true });
        }

        await interaction.reply("Banuje osobę...");

        try {
            await osobaDoZbanowania.ban();
            await interaction.editReply(`${customEmoticons.approved} Udało się zbanować ${osoba.username}!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`${customEmoticons.denided} Wystąpił błąd podczas próby zbanowania tej osoby.`);
        }
    }
};  
