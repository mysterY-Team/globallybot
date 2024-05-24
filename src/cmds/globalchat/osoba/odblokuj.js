const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, ownersID, customEmoticons, GCmodsID } = require("../../../config")
const { gcdata } = require("../../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!ownersID.includes(interaction.user.id) && !GCmodsID.includes(interaction.user.id))
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:\n- Nie jesteś na liście developerów bota\n- Nie jesteś na liście moderatorów GlobalChata`,
            })
        var uID = interaction.options.getUser("osoba", true).id
        try {
            await interaction.deferReply({
                ephemeral: interaction.inGuild(),
            })
            var snapshot = db.get(`userData/${uID}/gc`)

            if (!snapshot.exists) {
                interaction.editReply({
                    content: `${customEmoticons.minus} Ta osoba jeszcze nie utworzyła profilu...`,
                })
                return
            }

            var info = gcdata.encode(snapshot.val)

            if (!info.isBlocked) {
                interaction.editReply(`${customEmoticons.denided} Ta osoba nie jest zablokowana!`)
                return
            }

            info.isBlocked = false
            info.blockReason = ""
            const embedblock = new EmbedBuilder()
                .setTitle("Zostałeś odblokowany!")
                .setDescription(`Od teraz będziesz miał dostęp do GlobalChata, dopóki znów nie będziesz zablokowany!`)
                .setColor("Green")
                .setFields({
                    name: "Odblokowany przez",
                    value: `${(interaction.user.discriminator = "0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`)}`,
                })

            client.users.send(uID, {
                embeds: [embedblock],
            })

            interaction.editReply(`${customEmoticons.approved} Pomyślnie odblokowano użytkownika <@${uID}> \`${uID}\``)
            db.set(`userData/${uID}/gc`, gcdata.decode(info))
        } catch (err) {
            interaction.reply({
                content: "Coś poszło nie tak... spróbuj ponownie!",
            })
            console.warn(err)
        }
    },
}
