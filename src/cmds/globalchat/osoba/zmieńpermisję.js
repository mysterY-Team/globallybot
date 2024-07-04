const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, ownersID, customEmoticons } = require("../../../config")
const { gcdata } = require("../../../functions/dbs")
const { checkUserInSupport } = require("../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var user = interaction.options.get("osoba", true).user
        var perm = interaction.options.get("permisja", true).value
        var roles = ["zwykłą osobę", "moderatora GlobalChatu", "naczelnego GlobalChatu"]
        await interaction.deferReply()

        if (!(await checkUserInSupport(client, interaction.user.id))) {
            interaction.editReply(
                `${customEmoticons.info} Aby móc korzystać z całego potencjału GlobalChata, musisz dołączyć na serwer support! Możesz znaleźć link pod \`botinfo\`.`
            )
            return
        }

        var data = gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val)
        if (data.modPerms !== 2 && !ownersID.includes(interaction.user.id)) {
            interaction.editReply(`${customEmoticons.denided} Nie masz odpowiednich permisji do wykonania tej komendy!`)
            return
        }

        if (user.bot || user.system) {
            interaction.editReply(`${customEmoticons.denided} Możesz wpisać **tylko** osoby!`)
            return
        }

        if (!(await checkUserInSupport(client, user.id))) {
            interaction.editReply(`${customEmoticons.minus} Tej osoby nie ma w supporcie...`)
            return
        }

        data = gcdata.encode(db.get(`userData/${user.id}/gc`).val)
        if (data.modPerms === perm) {
            interaction.editReply(`${customEmoticons.minus} Permisja <@${user.id}> jest już ustawiona na ${roles[perm]}, nic nie zostało zmienione!`)
        } else {
            const prevModPerms = data.modPerms
            data.modPerms = perm
            db.set(`userData/${user.id}/gc`, gcdata.decode(data))
            interaction.editReply(
                `${customEmoticons.approved} <@${user.id}> (\`${user.username}\`) pomyślnie został ${prevModPerms - data.modPerms < 0 ? "awansowany" : "zdegradowany"} na ${
                    roles[perm]
                }!`
            )
        }
    },
}
