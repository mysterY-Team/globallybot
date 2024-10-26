import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
import { wait } from "../../../functions/useful.js"
import conf from "../../../config.js"
const { customEmoticons } = conf

export default {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
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
