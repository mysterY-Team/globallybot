import djs from "discord.js"
const { Client, ModalSubmitInteraction, EmbedBuilder } = djs
import conf from "../../config.js"
const { db, customEmoticons, supportServer } = conf
import { checkUserStatus, botPremiumInfo } from "../../functions/useful.js"

export default {
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ModalSubmitInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        const modalArgs = {
            id: interaction.fields.getTextInputValue("id").toLowerCase(),
            passwd: interaction.fields.getTextInputValue("passwd"),
        }

        await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam
        const premium = await botPremiumInfo(interaction.user.id, ssstatus)

        if (modalArgs.id.match(/[^a-z0-9_-]/g)) {
            interaction.editReply(`${customEmoticons.denided} ID zawiera niedozwolone znaki!`)
            setTimeout(() => interaction.deleteReply(), 5000)
        } else if (modalArgs.passwd.match(/[^a-zA-Z0-9._@!]/g)) {
            interaction.editReply(`${customEmoticons.denided} Hasło zawiera niedozwolone znaki!`)
            setTimeout(() => interaction.deleteReply(), 5000)
        } else {
            var stations = (await db.get(`stations`)).val ?? {}

            if (Object.values(stations).map((x) => x.split("|")[0] === interaction.user.id).length >= 1 + 2 * premium && !isInMysteryTeam) {
                interaction.editReply(`${customEmoticons.denided} Przekroczyłeś dozwoloną ilość stacji (${1 + 2 * premium})!`)
                setTimeout(() => interaction.deleteReply(), 3000)
            } else {
                if (Object.keys(stations).includes(modalArgs.id)) {
                    interaction.editReply(`${customEmoticons.denided} Już istnieje taka stacja!`)
                    setTimeout(() => interaction.deleteReply(), 3000)
                } else {
                    await db.get(`stations/${modalArgs.id}`, `${interaction.user.id}|${modalArgs.passwd}|`)
                    const emb = new EmbedBuilder()
                        .setTitle("Nowa stacja!")
                        .setDescription(
                            `ID: \`${modalArgs.id}\`\nHasłowane: ${modalArgs.passwd ? customEmoticons.approved : customEmoticons.denided}\nKreator: <@${interaction.user.id}>`
                        )
                        .setColor("Fuchsia")
                    await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send({ embeds: [emb] })

                    await interaction.editReply(`${customEmoticons.approved} Utworzono stację poprawnie!`)
                    setTimeout(() => interaction.deleteReply(), 3000)
                }
            }
        }
    },
}
