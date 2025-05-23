import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
import conf from "../../../../config.js"
const { db, customEmoticons } = conf
import { gcdata } from "../../../../functions/dbSystem.js"
import { checkUserStatus } from "../../../../functions/useful.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        var user = interaction.options.get("osoba", true).user
        var perm = interaction.options.get("permisja", true).value
        var roles = ["zwykłego użytkownika", "moderatora GlobalChatu", "starszego moderatora GlobalChatu", "naczelnego GlobalChatu", "starszego naczelnego GlobalChatu"]
        await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        var idata = gcdata.encode((await db.get(`userData/${interaction.user.id}/gc`)).val)
        if (idata.modPerms < 3 && !isInMysteryTeam) {
            interaction.editReply(`${customEmoticons.denided} Nie masz odpowiednich permisji do wykonania tej komendy!`)
            return
        }

        if (user.bot || user.system) {
            interaction.editReply(`${customEmoticons.denided} Możesz wpisać **tylko** osoby!`)
            return
        }

        var data = gcdata.encode((await db.get(`userData/${user.id}/gc`)).val)

        if (data.modPerms > idata.modPerms && !isInMysteryTeam) {
            interaction.editReply(`${customEmoticons.denided} Ta osoba stoi ponad Ciebie!`)
            return
        }

        if (perm > idata.modPerms && !isInMysteryTeam) {
            interaction.editReply(`${customEmoticons.denided} Możesz przydzielać tylko niższe lub równe rangi!`)
            return
        }

        if (data.modPerms === perm) {
            interaction.editReply(`${customEmoticons.minus} Permisja <@${user.id}> jest już ustawiona na ${roles[perm]}, nic nie zostało zmienione!`)
        } else {
            const prevModPerms = data.modPerms
            data.modPerms = perm
            await db.get(`userData/${user.id}/gc`, gcdata.decode(data))
            interaction.editReply(
                `${customEmoticons.approved} <@${user.id}> (\`${user.username}\`) pomyślnie został ${prevModPerms - data.modPerms < 0 ? "awansowany" : "zdegradowany"} na ${
                    roles[perm]
                }!`
            )
        }
    },
}
