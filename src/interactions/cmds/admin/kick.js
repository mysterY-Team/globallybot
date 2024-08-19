const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { wait } = require("../../../functions/useful")
const { customEmoticons } = require("../../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute(client, interaction) {
        const osoba = interaction.options.get("osoba", true).member
        const powod = interaction.options.get("powód")?.value

        if (interaction.user.id === osoba.id) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie możesz wyrzucić siebie.`, ephemeral: true })
        }

        if (!osoba) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie mogę znaleźć tej osoby na serwerze.`, ephemeral: true })
        }

        if (interaction.member.roles.highest.position <= osoba.roles.highest.position && !interaction.guild.ownerId === interaction.member.id) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie możesz wyrzucić osoby wyższej od siebie.`, ephemeral: true })
        }

        if (!osoba.kickable) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie mogę wyrzucić tej osoby!`, ephemeral: true })
        }

        await interaction.deferReply()

        try {
            await osoba.kick(powod)
            await interaction.editReply(`${customEmoticons.approved} Udało się wyrzucić ${osoba.username}!\n${customEmoticons.info} Powód: ${powod}`)
        } catch (error) {
            console.error(error)
            await interaction.editReply(`${customEmoticons.denided} Wystąpił błąd podczas próby zbanowania tej osoby.`)
        }
    },
}
