const { CommandInteraction, Client } = require("discord.js")
const { db, customEmoticons } = require("../../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!ownersID.includes(interaction.user.id))
            return interaction.reply({
                content: `${customEmoticons.denided} Nie jesteś właścicielem bota!`,
                ephemeral: true,
            })

        const user = interaction.options.get("osoba", true).user
        const days = interaction.options.get("dni")?.value
        if (typeof days === "number") {
            if (days === 0) {
                db.delete(`userData/${user.id}/premium`)
                interaction.reply(`${customEmoticons.approved} Usunięto pomyślnie użytkownikowi premium!`)
                try {
                    user.send(
                        `No cześć, mam złą wiadomość. ${interaction.user} (\`${interaction.user.username}\`) właśnie Ci usunął premium! Wierzę, że kiedyś go odzyskasz!\n-# Globally, powered by mysterY Team`
                    )
                } catch (e) {}
            } else {
                db.set(`userData/${user.id}/premium`, days)
                interaction.reply(`${customEmoticons.approved} Nadano pomyślnie użytkownikowi **${days}** dni premium!`)
                try {
                    user.send(
                        `No cześć, mam dobrą wiadomość. ${interaction.user} (\`${interaction.user.username}\`) właśnie nadał Ci **${days} dni premium**! Gratuluję!\n-# Globally, powered by mysterY Team`
                    )
                } catch (e) {}
            }
        } else {
            const dbDays = db.get(`userData/${user.id}/premium`).val ?? 0
            if (dbDays) {
                interaction.reply("Ten użytkownik nie ma premium")
            } else {
                interaction.reply(`Ten użytkownik ma premium (zostało mu **${dbDays}** dni)`)
            }
        }
    },
}
