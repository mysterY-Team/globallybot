import djs from "discord.js"
import conf from "../../../../config.js"
import { checkUserStatus } from "../../../../functions/useful.js"
import { gcdataGuild } from "../../../../functions/dbSystem.js"

const { ChatInputCommandInteraction, Client, InteractionContextType, PermissionFlagsBits, EmbedBuilder, AutocompleteFocusedOption } = djs
const { db, customEmoticons, supportServer } = conf

const list = {
    useGA: {
        name: "Używaj GlobalActions",
        type: "boolean",
    },
    showGCButtons: {
        name: "Pokaż przyciski GlobalChat we wiadomości",
        type: "boolean",
    },
    wbUserName: {
        name: "Nazwa Webhooka (użytkownik)",
        type: "GCWebhookUSystem",
    },
}

export default {
    /**
     * @param {import("discord.js").AutocompleteFocusedOption} acFocusedInformation
     * @param {import("discord.js").Client<true>} client
     */
    async autocomplete(acFocusedInformation, client) {
        return Object.entries(list)
            .map((x) => [x[0], { name: x[1].name, value: x[0] }])
            .flat()
            .filter((x) => (x.name ?? x).includes(acFocusedInformation.value))
            .filter((x, i) => i < 25)
    },
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.context != InteractionContextType.Guild) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)
        //argument kanału i serwer
        await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam
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
                    - Nie jesteś w drużynie **mysterY**`
                    .split("\n")
                    .map((x) => x.trim())
                    .join("\n"),
            })

        var snapshot = await db.get(`serverData/${interaction.guildId}/gc`)
        var key = Object.entries(gcdataGuild.encode(snapshot.val ?? "")).find((x) => x[1].channel === channel.channel.id)
        if (!key) return interaction.editReply(`${customEmoticons.denided} Nie ma podpiętej stacji na tym kanale`)
        var data = gcdataGuild.encode(snapshot.val)

        var flag = interaction.options.get("flaga", true).value
        var flagValue = interaction.options.get("wartość", true).value
        var errorReason = null
        var val = null

        if (!Object.keys(list).includes(flag)) {
            interaction.editReply(`${customEmoticons.info} Ta flaga ma tą właśnie wartość!`)
            return
        }

        if (key[1][`flag_${flag}`] == flagValue) {
            interaction.editReply(`${customEmoticons.info} Ta flaga ma tą właśnie wartość!`)
            return
        }

        switch (list[flag].type) {
            case "boolean": {
                const yes = ["yes", "y", "true", "tak", "t", "prawda"]
                const no = ["no", "nie", "n", "false", "fałsz"]
                if (yes.includes(flagValue.toLowerCase())) val = true
                else if (no.includes(flagValue.toLowerCase())) val = false
                else errorReason = "błąd składni"
                break
            }
            case "GCWebhookUSystem": {
                var tv = ""
                if (!key[1].flag_showGCButtons) errorReason = "wymagane włączenie przycisków GlobalChat we wiadomościach (`showGCButtons`)"
                else if (!flagValue.match(/%username%/i)) errorReason = "brak tagu `%username%`"
                else if (flagValue.match(/[{}]/)) errorReason = "niedozwolony znak"
                else if (flagValue.includes("GlobalAction")) errorReason = "fraza `GlobalAction`"
                else if (
                    (tv = String(flagValue)
                        .replace(/%username%/i, "*".repeat(36))
                        .replace(/%userid%/i, "*".repeat(19))
                        .replace(/%userrole%/i, "*".repeat(14))
                        .replace(/%guildid%/i, "*".repeat(13))
                        .replace(/%guildname%/i, "*".repeat(36))).length > 80
                )
                    errorReason = "za długa nazwa"
                else val = flagValue
                break
            }
        }

        if (errorReason) {
            interaction.editReply(`${customEmoticons.denided} Nie udało się ustawić tej flagi. Powód: ${errorReason}`)
            return
        }

        key[1][`flag_${flag}`] = val
        key[1].createdTimestamp = Math.floor(Date.now() / 1000)
        data[key[0]] = key[1]

        await db.get(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))
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
