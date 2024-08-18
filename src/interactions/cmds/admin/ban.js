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

        if (!interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: `${customEmoticons.denied} Nie masz permisji do banowania.`, ephemeral: true });
        }

        if (interaction.user.id === osoba.id) {
            return interaction.reply({ content: `${customEmoticons.denied} Nie możesz zbanować siebie.`, ephemeral: true });
        }

        const osobaDoZbanowania = interaction.guild.members.resolve(osoba);

        if (!memberToBan) {
            return interaction.reply({ content: `${customEmoticons.denied} Nie mogę znaleźć tej osoby na serwerze.`, ephemeral: true });
        }


        if (!memberToBan.bannable) {
            return interaction.reply({ content: `${customEmoticons.denied} Nie mogę zbanować tej osoby.`, ephemeral: true });
        }

        if (interaction.member.roles.highest.position <= osobaDoZbanowania.roles.highest.position) {
            return interaction.reply({ content: `${customEmoticons.denied} Nie możesz zbanować osoby wyższej od siebie.`, ephemeral: true });
        }

        await interaction.reply("Banuje osobę...");

        try {
            await osobaDoZbanowania.ban();
            await wait(1000);
            await interaction.editReply(`${customEmoticons.approved} Udało się zbanować ${osoba.username}!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`${customEmoticons.denied} Wystąpił błąd podczas próby zbanowania tej osoby.`);
        }
    }
};
