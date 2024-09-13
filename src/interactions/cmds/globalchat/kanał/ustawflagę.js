const { ChatInputCommandInteraction, Client, InteractionContextType, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const { db, customEmoticons, _bot, supportServer } = require("../../../../config")
const { request } = require("undici")
const { checkUserStatus } = require("../../../../functions/useful")
const { gcdataGuild } = require("../../../../functions/dbSystem")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.context != InteractionContextType.Guild) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)
        //argument kanału i serwer
        await interaction.deferReply()
        var channel = interaction.options.get("kanał", true)
        var guild = interaction.guild
        if (
            !(
                interaction.member.permissions.has(PermissionFlagsBits.ManageWebhooks + PermissionFlagsBits.ManageChannels) ||
                interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
                interaction.user.id == guild.ownerId ||
                isInMysteryTeam
            )
        )
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.editReply({
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:
                    - Nie masz obu uprawnień: **Zarządzanie webhoookami** oraz **Zarządzanie kanałami**
                    - Nie masz permisji administratora
                    - Nie jesteś właścicielem serwera
                    - Nie posiadasz roli **mysterY Team** na serwerze support`
                    .split("\n")
                    .map((x) => x.trim())
                    .join("\n"),
            })

        var snapshot = db.get(`serverData/${interaction.guildId}/gc`)
        var key = Object.entries(gcdataGuild.encode(snapshot.val ?? "")).find((x) => x[1].channel === channel.channel.id)
        if (!key) return interaction.editReply(`${customEmoticons.denided} Nie ma podpiętej stacji na tym kanale`)
        var data = gcdataGuild.encode(snapshot.val)

        // create the setting structure. Use properties started with "flag_"
        var flag = interaction.options.get("flaga", true).value
        var flagValue = interaction.options.get("wartość", true).value
        var errorReason = null
        var val = null

        switch (flag) {
            case "showGCButtons": {
                const yes = ["yes", "y", "true", "tak", "t", "prawda"]
                const no = ["no", "nie", "n", "false", "fałsz"]
                if (yes.includes(flagValue.toLowerCase())) val = true
                else if (no.includes(flagValue.toLowerCase())) val = false
                else errorReason = "błąd składni"
                break
            }
            case "wbUserName": {
                if (!key[1].flag_showGCButtons) errorReason = "wymagane włączenie przycisków GlobalChat we wiadomościach (`showGCButtons`)"
                else if (!flagValue.match(/%username%/i) || !flagValue.match(/%userrole%/i)) errorReason = "brak tagów `%username%` i/lub `%userrole%`"
                else if (flagValue.match(/[{}]/)) errorReason = "niedozwolony znak"
                else val = flagValue
                break
            }
            default: {
                errorReason = "nieznana flaga"
            }
        }

        //check the errorReason, and save "val" to data
        if (errorReason) {
            interaction.editReply(`${customEmoticons.denided} Nie udało się ustawić tej flagi. Powód: ${errorReason}`)
            return
        }

        key[1][`flag_${flag}`] = val
        key[1].createdTimestamp = Math.floor(Date.now() / 1000)
        data[key[0]] = key[1]

        db.set(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))
        interaction.editReply(`${customEmoticons.approved} Zmieniono flagę \`${flag}\` na \`${val}\`!`)

        const emb = new EmbedBuilder()
            .setTitle("Zmieniono flagę!")
            .setDescription(
                `ID kanału: \`${channel.channel.id}\`\nNazwa kanału: \`${channel.channel.name}\`\nStacja: \`${key[0]}\`\nFlaga: \`${flag}\`\nWartość: \`${flagValue}\`\nOsoba zmieniająca: <@${interaction.user.id}> (\`${interaction.user.username}\`, \`${interaction.user.id}\`)`
            )
            .setColor("Blue")
        await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send({ embeds: [emb] })
    },
}
