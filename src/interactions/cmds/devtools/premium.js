import djs from "discord.js"
const { ChatInputCommandInteraction, Client } = djs
import conf from "../../../config.js"
const { db, customEmoticons } = conf
import { checkUserStatus } from "../../../functions/useful.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply()
        const ssstatus1 = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam1 = ssstatus1.inSupport && ssstatus1.mysteryTeam

        if (!isInMysteryTeam1)
            return interaction.editReply({
                content: `${customEmoticons.denided} Nie jesteś członkiem drużyny **mysterY**!`,
                ephemeral: true,
            })

        const user = interaction.options.get("osoba", true).user
        const days = interaction.options.get("dni")?.value

        const ssstatus2 = await checkUserStatus(client, user.id)
        const isInMysteryTeam2 = ssstatus2.inSupport && ssstatus2.mysteryTeam

        if (isInMysteryTeam2)
            return interaction.editReply({
                content: `${customEmoticons.info} Nie żeby coś, ale premium nie wpływa na członka drużyny **mysterY**`,
                ephemeral: true,
            })

        if (typeof days === "number") {
            if (days === 0) {
                await db.adelete(`userData/${user.id}/premium`)
                interaction.editReply(`${customEmoticons.approved} Usunięto pomyślnie użytkownikowi premium!`)
                try {
                    user.send(
                        `No cześć, mam złą wiadomość. ${interaction.user} (\`${interaction.user.username}\`) właśnie Ci usunął premium! Wierzę, że kiedyś go odzyskasz!\n-# Globally, powered by mysterY`
                    )
                } catch (e) {}
            } else {
                await db.aset(`userData/${user.id}/premium`, days)
                interaction.editReply(`${customEmoticons.approved} Nadano pomyślnie użytkownikowi **${days}** dni premium!`)
                try {
                    user.send(
                        `No cześć, mam dobrą wiadomość. ${interaction.user} (\`${interaction.user.username}\`) właśnie nadał Ci **${days} dni premium**! Gratuluję!\n-# Globally, powered by mysterY`
                    )
                } catch (e) {}
            }
        } else {
            const dbDays = (await db.aget(`userData/${user.id}/premium`)).val ?? 0
            if (dbDays === 0) {
                interaction.editReply(`Użytkownik ${user} (\`${user.username}\`) nie ma premium`)
            } else {
                interaction.editReply(`Użytkownik ${user} (\`${user.username}\`) ma premium (zostało mu **${dbDays}** dni)`)
            }
        }
    },
}
