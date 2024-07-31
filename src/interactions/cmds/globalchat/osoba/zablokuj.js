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
            var buser = interaction.options.get("osoba", true).user

            if (buser.id === interaction.user.id) {
                interaction.reply({
                    ephemeral: interaction.inGuild(),
                    content: `Zablokować siebie? Serio?`,
                })
                return
            }
            await interaction.deferReply({
                ephemeral: interaction.inGuild(),
            })

            var info = gcdata.encode(db.get(`userData/${buser.id}/gc`).val)

            if (Math.max(yourInfo.modPerms, ownersID.includes(interaction.user.id) * 11 - 1) <= info.modPerms || ownersID.includes(buser.id)) {
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
            info.blockReason = interaction.options.get("powód")?.value ?? ""
            info.blockTimestamp = Math.round(Date.now() / 3_600_000) + (interaction.options.get("czas")?.value || Infinity)

            const embedblock = new EmbedBuilder()
                .setTitle("Zostałeś zablokowany!")
                .setDescription(`Od teraz nie będziesz miał dostępu do GlobalChata!`)
                .setColor("Red")
                .setFields(
                    {
                        name: "Blokowany przez",
                        value: `\`${interaction.user.username}\``,
                    },
                    {
                        name: "Powód",
                        value: interaction.options.get("powód") == null ? customEmoticons.denided : `\`\`\`${interaction.options.get("powód", false).value}\`\`\``,
                    },
                    {
                        name: "Czas blokady",
                        value: `${interaction.options.get("czas") ? interaction.options.get("czas").value + " godzin (± 30 minut)" : "Do odwołania"}`,
                    }
                )

            client.users.send(buser.id, {
                embeds: [embedblock],
            })
            const emb = new EmbedBuilder()
                .setTitle("Zablokowano użytkownika!")
                .setDescription(
                    [
                        `Osoba zablokowana: \`${buser.username}\` (\`${buser.id}\`)`,
                        `Osoba blokująca: ${interaction.user} (\`${interaction.user.username}\`, \`${interaction.user.id}\`)`,
                        `Powód blokady: ${interaction.options.get("powód") ? `\`\`\`${interaction.options.get("powód").value}\`\`\`` : customEmoticons.denided}`,
                        `Czas blokady (w godzinach): **${interaction.options.get("czas")?.value || customEmoticons.minus}**`,
                    ].join("\n")
                )
                .setColor("Red")
            await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.blocks)).send({ embeds: [emb] })

            interaction.editReply({
                content: `${customEmoticons.approved} Pomyślnie zablokowano użytkownika ${buser} (\`${buser.username}\`, \`${buser.id}\`)`,
            })
            db.set(`userData/${buser.id}/gc`, gcdata.decode(info))
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
