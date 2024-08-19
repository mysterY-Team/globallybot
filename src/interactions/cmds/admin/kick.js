const { CommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { wait } = require("../../../functions/useful");
const { customEmoticons } = require("../../../config")

module.exports = {
    /**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */

    async execute(client, interaction) {
        const osoba = interaction.options.getUser("osoba")
        const powód = interaction.options.getString("powód")

        const osobaDoZkickowania = interaction.guild.members.resolve(osoba);
        await interaction.reply(`Sprawdzam czy spełniasz wszystkie wymagania...`)
        if (!osobaDoZkickowania) return interaction.editReply({ content: `${customEmoticons.denided} Nie mogę znaleźć tej osoby na serwerze.`, ephemeral: true })

        if (interaction.user.id === osoba.id) return interaction.editReply({ content: `${customEmoticons.denided} Nie możesz wyrzucić siebie.`, ephemeral: true })
        
        if (interaction.member.roles.highest.position <= osobaDoZkickowania.roles.highest.position && !interaction.guild.ownerId === interaction.member.id) return interaction.editReply({ content: `${customEmoticons.denided} Nie możesz wyrzucić wyższej osoby od Ciebie.`, ephemeral: true });
        
        if (!osobaDoZkickowania.kickable) return interaction.editReply({ content: `${customEmoticons.denided} Nie mogę wyrzucić tej osoby.`, ephemeral: true });
        
        

        try {
            await osobaDoZkickowania.kick();
            await interaction.editReply(`${customEmoticons.approved} Udało się wyrzucić ${osoba.username}!\n ${customEmoticons.info} Powód: ${powód}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`${customEmoticons.denided} Wystąpił błąd podczas próby wyrzucania tej osoby.`);
        }
    }
}