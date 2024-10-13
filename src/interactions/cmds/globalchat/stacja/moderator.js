const { ChatInputCommandInteraction, Client } = require("discord.js")
const { db, customEmoticons } = require("../../../../config")
const { gcdata } = require("../../../../functions/dbSystem")
const { checkUserStatus } = require("../../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const stationID = interaction.options.get("stacja", true).value
        const user = interaction.options.get("osoba", true).user

        await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, user.id, false)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        const udata = gcdata.encode(db.get(`userData/${user.id}`).val)

        var snapshot = db.get(`stations/${stationID}`)
        if (!snapshot.exists) {
            interaction.editReply(`${customEmoticons.denided} Nie ma takiej stacji!`)
            return
        }
        if (!snapshot.val.startsWith(interaction.user.id)) {
            interaction.editReply(`${customEmoticons.denided} Nie jesteś założycielem stacji!`)
            return
        }

        if (user.id === interaction.user.id) {
            interaction.editReply(`${customEmoticons.info} Jako że jesteś właścicielem stacji, jesteś z automatu jego moderatorem`)
            return
        }

        if (isInMysteryTeam || udata.modPerms != 0) {
            interaction.editReply(`${customEmoticons.denided} Ta osoba ma dostęp do moderowania całym GlobalChatem`)
            return
        }

        var data = snapshot.val.split("|")
        if (data.length < 3) data.push([])
        else data[2] = data[2].split(",")

        if (data[2].includes(user.id)) {
            data[2] = data[2].filter((x) => x !== user.id).join(",")
            interaction.editReply(`${customEmoticons.approved} Pomyślnie usunięto ${user} jako moderatora stacji!`)
        } else if (data[2].length >= 15) {
            interaction.editReply(`${customEmoticons.minus} Przekroczono limit moderatorów (maksymalnie 15 na stację)!`)
            return
        } else {
            data[2].push(user.id)
            data[2] = data[2].join(",")
            interaction.editReply(`${customEmoticons.approved} Pomyślnie dodano ${user} jako moderatora stacji!`)
        }
        db.set(`stations/${stationID}`, data.join("|"))
    },
}
