const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, customEmoticons, supportServer } = require("../../../../config")
const { gcdata } = require("../../../../functions/dbSystem")
const { checkUserStatus } = require("../../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        await interaction.deferReply({
            ephemeral: interaction.inGuild(),
        })
        var yourInfo = gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val)
        const ssstatus1 = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam1 = ssstatus1.inSupport && ssstatus1.mysteryTeam

        if (!isInMysteryTeam1 && yourInfo.modPerms === 0)
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.editReply({
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:\n- Nie jesteś na liście developerów bota\n- Nie masz odpowiednich permisji w bocie`,
            })

        var uID = interaction.options.get("osoba", true).user.id
        const ssstatus2 = await checkUserStatus(client, uID)
        const isInMysteryTeam2 = ssstatus2.inSupport && ssstatus2.mysteryTeam

        if (uID === interaction.user.id) {
            interaction.editReply({
                content: `Ejejej, bez przesady kolego`,
            })
            return
        }

        var info = gcdata.encode(db.get(`userData/${uID}/gc`).val)
        if (Math.max(yourInfo.modPerms, isInMysteryTeam1 * 11 - 1) <= info.modPerms || isInMysteryTeam2) {
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
        info.blockTimestamp = NaN

        const embedblock = new EmbedBuilder()
            .setTitle("Zostałeś odblokowany!")
            .setDescription(`Od teraz będziesz miał dostęp do GlobalChata, dopóki znów nie będziesz zablokowany!`)
            .setColor("Green")
            .setFields({
                name: "Odblokowany przez",
                value: `${(interaction.user.discriminator = "0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`)}`,
            })
        const emb = new EmbedBuilder()
            .setTitle("Odblokowano użytkownika!")
            .setDescription(
                `Osoba odblokowana: \`${interaction.options.get("osoba", true).user.username}\` (\`${uID}\`)\nOsoba odblokowująca: ${interaction.user} (\`${
                    interaction.user.username
                }\`, \`${interaction.user.id}\`)`
            )
            .setColor("Green")
        await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.blocks)).send({ embeds: [emb] })

        client.users.send(uID, {
            embeds: [embedblock],
        })

        interaction.editReply(`${customEmoticons.approved} Pomyślnie odblokowano użytkownika <@${uID}> (\`${interaction.options.get("osoba", true).user.username}\`, \`${uID}\`)`)
        db.set(`userData/${uID}/gc`, gcdata.decode(info))
    },
}
