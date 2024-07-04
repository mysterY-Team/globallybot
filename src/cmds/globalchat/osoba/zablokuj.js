const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, ownersID, customEmoticons } = require("../../../config")
const { gcdata } = require("../../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!ownersID.includes(interaction.user.id) && gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val).modPerms === 0)
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:\n- Nie jesteś na liście developerów bota\n- Nie masz odpowiednich permisji w bocie`,
            })

        try {
            var uID = interaction.options.get("osoba", true).user.id
            await interaction.deferReply({
                ephemeral: interaction.inGuild(),
            })

            var snapshot = db.get(`userData/${uID}/gc`)
            if (!snapshot.exists) {
                interaction.editReply({
                    content: `${customEmoticons.minus} Ta osoba nie pisała na GlobalChacie...`,
                })
                return
            }

            var info = gcdata.encode(snapshot.val)

            if (info.isBlocked) {
                interaction.editReply({
                    content: `${customEmoticons.denided} Ta osoba jest zablokowana!`,
                })
                return
            }

            info.isBlocked = true
            info.blockReason = interaction.options.get("powód") == null ? "" : interaction.options.get("powód").value
            const embedblock = new EmbedBuilder()
                .setTitle("Zostałeś zablokowany!")
                .setDescription(`Od teraz nie będziesz miał dostępu do GlobalChata do odwołania!`)
                .setColor("Red")
                .setFields(
                    {
                        name: "Blokowany przez",
                        value: `${(interaction.user.discriminator = "0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`)}`,
                    },
                    {
                        name: "Powód",
                        value: interaction.options.get("powód") == null ? customEmoticons.denided : `\`\`\`${interaction.options.get("powód", false).value}\`\`\``,
                    }
                )

            client.users.send(uID, {
                embeds: [embedblock],
            })

            interaction.editReply({
                content: `${customEmoticons.approved} Pomyślnie zablokowano użytkownika <@${uID}> \`${uID}\``,
            })
            db.set(`userData/${uID}/gc`, gcdata.decode(info))
        } catch (err) {
            interaction.reply({
                content: "Coś poszło nie tak... spróbuj ponownie!",
            })
            console.warn(err)
        }
    },
}
