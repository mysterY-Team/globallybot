const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, ownersID, customEmoticons, supportServer } = require("../../../../config")
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

        try {
            var uID = interaction.options.get("osoba", true).user.id

            if (uID === interaction.user.id) {
                interaction.reply({
                    ephemeral: interaction.inGuild(),
                    content: `Zablokować siebie? Serio?`,
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

            if (info.isBlocked) {
                interaction.editReply({
                    content: `${customEmoticons.denided} Ta osoba jest zablokowana!`,
                })
                return
            }

            info.isBlocked = true
            info.blockReason = interaction.options.get("powód") == null ? "" : interaction.options.get("powód").value
            var blockData = new Date(); 
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
                    },
                    {
                        name: "Czas",
                        value: interaction.options.get("czas") == null ? customEmoticons.denided : `\`\`\`${interaction.options.get("czas", false).value}\`\`\``,
                    }
                )

            client.users.send(uID, {
                embeds: [embedblock],
            })
            const emb = new EmbedBuilder()
                .setTitle("Zablokowano użytkownika!")
                .setDescription(
                    `Osoba zablokowana: \`${interaction.options.get("osoba", true).user.username}\` (\`${uID}\`)\nOsoba blokująca: ${interaction.user} (\`${
                        interaction.user.username
                    }\`, \`${interaction.user.id}\`)\nPowód blokady: ${
                        interaction.options.get("powód") ? `\`\`\`${interaction.options.get("powód").value}\`\`\`` : customEmoticons.denided
                    }`
                )
                .setColor("Red")
            await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.blocks)).send({ embeds: [emb] })

            interaction.editReply({
                content: `${customEmoticons.approved} Pomyślnie zablokowano użytkownika <@${uID}> (\`${interaction.options.get("osoba", true).user.username}\`, \`${uID}\`)`,
            })
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
