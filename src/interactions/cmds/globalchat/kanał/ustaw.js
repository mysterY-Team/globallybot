import djs from "discord.js"
const { ChatInputCommandInteraction, Client, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = djs

import conf from "../../../../config.js"
const { db, customEmoticons, _bot, supportServer, constPremiumServersIDs } = conf
import { gcdataGuild } from "../../../../functions/dbSystem.js"
import { checkUserStatus } from "../../../../functions/useful.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const pwd = interaction.options.get("passwd")?.value

        if (interaction.context != InteractionContextType.Guild) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)

        if (pwd) await interaction.deferReply({ flags: ["Ephemeral"] })
        else await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        //argument kanału i serwer
        var channel = interaction.options.get("kanał", true)
        var guild = interaction.guild
        var bot = guild.members.me

        const botPerms = channel.channel.permissionsFor(bot)
        const userPerms = interaction.member.permissions
        if (
            !(userPerms.has(PermissionFlagsBits.ManageWebhooks) && userPerms.has(PermissionFlagsBits.ManageChannels)) &&
            !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
            interaction.user.id != guild.ownerId &&
            !isInMysteryTeam
        )
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.editReply({
                content: `${customEmoticons.denided} Ta komenda jest dostępna dla osób:
                    - poisadających jednocześnie uprawnienia **Zarządzanie webhoookami** oraz **Zarządzanie kanałami**
                    - mających permisję administratora
                    - jako właściciela serwera
                    - z drużyny **mysterY**`
                    .split("\n")
                    .map((x) => x.trim())
                    .join("\n"),
            })
        //sprawdzanie widoczności kanału
        if (!channel.channel || !botPerms.has("ViewChannel")) {
            return interaction.editReply(`${customEmoticons.denided} Kanał jest niedostępny! Czy na pewno mam do niego dostęp?`)
        }
        if (!botPerms.has(PermissionFlagsBits.Administrator) && !(botPerms.has("ManageWebhooks") && botPerms.has("ManageMessages") && botPerms.has("SendMessages")))
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.editReply({
                content: `${customEmoticons.denided} Bot potrzebuje permisji admina lub uprawnień **Zarządzanie webhookami**, **Zarządzanie wiadomościami** oraz **Wysyłanie wiadomości**`,
            })

        //wczytywanie danych
        var allsnpsht = await db.aget(`serverData/${interaction.guildId}/gc`)
        var gccount = allsnpsht.exists ? Object.keys(gcdataGuild.encode(allsnpsht.val ?? "")).length : 0

        if (gccount >= 3 + 4 * constPremiumServersIDs.includes(interaction.guildId) && interaction.guildId !== supportServer.id) {
            return interaction.editReply(`${customEmoticons.denided} Przekroczony został limit ustawionych stacji!`)
        }

        var $stacja = interaction.options.get("stacja", true).value
        // Daj listę stacji
        var stationData = (await db.aget(`stations/${$stacja}`)).val

        if (!stationData) {
            return interaction.editReply(`${customEmoticons.denided} Nie ma takiej stacji!`)
        }

        var serverData = Object.values((await db.aget("serverData")).val || {})
        serverData = serverData.filter((x) => x.gc && x.gc.includes($stacja))

        if (serverData.length >= 25) {
            interaction.editReply(`${customEmoticons.denided} Ta stacja została przepełniona! Podłączyło się już 25 serwerów`)
            return
        }

        stationData = stationData.split("|")
        if (!pwd && stationData[1]) {
            return interaction.editReply(`${customEmoticons.info} Ta stacja wymaga użycia argumentu \`passwd\``)
        }
        if (stationData[1] && pwd !== stationData[1]) {
            return interaction.editReply(`${customEmoticons.denided} Niepoprawne hasło!`)
        }

        var _bool = Boolean(allsnpsht.val?.includes(channel.value))

        var data = gcdataGuild.encode(allsnpsht.val ?? "")
        if (data[$stacja]?.channel == channel.value) return interaction.editReply(`${customEmoticons.denided} Na tym kanale jest już ustawiony GlobalChat o tej stacji!`)

        if (_bool) {
            return interaction.editReply(`${customEmoticons.denided} Ten kanał ma już odrębną stację!`)
        }

        var newStationData = gcdataGuild.encode("x{}").x
        newStationData.channel = channel.channel.id
        data[$stacja] = newStationData

        await db.aset(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))

        await db.aset(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))

        interaction.editReply(`${customEmoticons.approved} Dodano pomyślnie kanał na stacji \`${$stacja}\`!`)

        const emb = new EmbedBuilder()
            .setTitle("Podpięto kanał!")
            .setDescription(
                `ID kanału: \`${channel.channel.id}\`\nNazwa kanału: \`${channel.channel.name}\`\nID Serwera: \`${channel.channel.guildId}\`\nStacja: \`${$stacja}\`\nOsoba podłączająca: <@${interaction.user.id}> (\`${interaction.user.username}\`, \`${interaction.user.id}\`)`
            )
            .setColor("Blue")
        await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send({ embeds: [emb] })
    },
}
