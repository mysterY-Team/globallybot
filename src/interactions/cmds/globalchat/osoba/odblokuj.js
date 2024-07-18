const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, ownersID, customEmoticons } = require("../../../../config")
const { gcdata } = require("../../../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        var yourInfo = gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val)
        if (!ownersID.includes(interaction.user.id) && yourInfo.modPerms === 0)
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:\n- Nie jesteś na liście developerów bota\n- Nie masz odpowiednich permisji w bocie`,
            })
        var uID = interaction.options.get("osoba", true).user.id
        try {
            if (uID === interaction.user.id) {
                interaction.reply({
                    ephemeral: interaction.inGuild(),
                    content: `Ejejej, bez przesady kolego`,
                })
                return
            }
            await interaction.deferReply({
                ephemeral: interaction.inGuild(),
            })

            var info = gcdata.encode(db.get(`userData/${uID}/gc`).val)
            if (Math.max(yourInfo.modPerms, ownersID.includes(interaction.user.id) * 11 - 1) <= info.modPerms || ownersID.includes(uID)) {
                interaction.editReply({
                    content: `${customEmoticons.denided} Ta osoba jest ponad/na równi twoich permisji!`,
                })
                return
            }

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
            if (interaction.deferred)
                interaction.editReply({
                    content: "Coś poszło nie tak... spróbuj ponownie!",
                })
            else
                interaction.reply({
                    ephemeral: true,
                    content: "Coś poszło nie tak... spróbuj ponownie!",
                })
            console.warn(err)
        }
    },
}
