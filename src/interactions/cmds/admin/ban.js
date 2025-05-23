import djs from "discord.js"
const { Client, ChatInputCommandInteraction, PermissionsBitField } = djs
import conf from "../../../config.js"
const { customEmoticons } = conf

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(client, interaction) {
        const osoba = await interaction.options.get("osoba", true).member?.fetch()
        const powod = interaction.options.get("powód")?.value

        if (interaction.user.id === osoba?.id) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie możesz zbanować siebie.`, flags: ["Ephemeral"] })
        }

        if (!osoba) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie mogę znaleźć tej osoby na serwerze.`, flags: ["Ephemeral"] })
        }

        if (interaction.member.roles.highest.position <= osoba.roles.highest.position && !interaction.guild.ownerId === interaction.member.id) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie możesz zbanować osoby wyższej od siebie.`, flags: ["Ephemeral"] })
        }

        if (!osoba.bannable) {
            return interaction.reply({ content: `${customEmoticons.denided} Nie mogę zbanować tej osoby!`, flags: ["Ephemeral"] })
        }

        await interaction.deferReply()

        try {
            await osoba.ban({ reason: powod })
            await interaction.editReply(
                `${customEmoticons.approved} Udało się zbanować ${osoba} (\`${osoba.username}\`, \`${osoba.id}\`)!\n${customEmoticons.info} Powód: ${powod}`
            )
        } catch (error) {
            console.warn(error)
            await interaction.editReply(`${customEmoticons.denided} Wystąpił błąd podczas próby zbanowania tej osoby.`)
        }
    },
}
