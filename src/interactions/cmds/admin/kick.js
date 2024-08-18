const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { wait } = require("../../../functions/useful");

module.exports = {
    /**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

    async execute(client, interaction) {
        const osoba = interaction.options.getUser("osoba")

        const osobaDoZkickowania = interaction.guild.members.resolve(osoba);
        await interaction.reply(`Sprawdzam czy spełniasz wszystkie wymagania...`)
        if (!osobaDoZbanowania) return interaction.editReply({ content: `${customEmoticons.denided} Nie mogę znaleźć tej osoby na serwerze.`, ephemeral: true });
        
        if (interaction.member.roles.highest.position <= osobaDoZbanowania.roles.highest.position && !interaction.guild.ownerId === interaction.member.id) return interaction.editReply({ content: `${customEmoticons.denided} Nie możesz wyrzucić wyższej osoby od Ciebie.`, ephemeral: true });
        
        if (!osobaDoZbanowania.kickable) return interaction.editReply({ content: `${customEmoticons.denided} Nie mogę wyrzucić tej osoby.`, ephemeral: true });
        
        if (interaction.user.id === osoba.id) return interaction.editReply({ content: `${customEmoticons.denided} Nie możesz wyrzucić siebie.`, ephemeral: true })
        
        wait(3000)
        interaction.deleteReply()

        try {
            await osobaDoZbanowania.kick();
            await interaction.editReply(`${customEmoticons.approved} Udało się wyrzucić ${osoba.username}!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`${customEmoticons.denided} Wystąpił błąd podczas próby wyrzucania tej osoby.`);
        }
    }
}