const { ChatInputCommandInteraction, Client, PermissionFlagsBits, EmbedBuilder, InteractionContextType } = require("discord.js")
const { db, customEmoticons, _bot, supportServer, constPremiumServersIDs } = require("../../../../config")
const { gcdataGuild } = require("../../../../functions/dbSystem")
const { checkUserStatus } = require("../../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const pwd = interaction.options.get("passwd")?.value

        if (interaction.context != InteractionContextType.Guild) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)

        await interaction.deferReply({ ephemeral: Boolean(pwd) })
        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        //argument kanału i serwer
        var channel = interaction.options.get("kanał", true)
        var guild = interaction.guild
        var bot = guild.members.cache.get(_bot.id)
        if (
            !(
                (interaction.member.permissions.has(PermissionFlagsBits.ManageWebhooks + PermissionFlagsBits.ManageChannels) ||
                    interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
                    interaction.user.id == guild.ownerId ||
                    isInMysteryTeam) &&
                (bot.permissions.has(PermissionFlagsBits.Administrator) ||
                    (bot.permissions.has(PermissionFlagsBits.ManageWebhooks) &&
                        bot.permissions.has(PermissionFlagsBits.ManageMessages) &&
                        bot.permissions.has(PermissionFlagsBits.SendMessages)))
            )
        )
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.editReply({
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:
                    - Nie masz obu uprawnień: **Zarządzanie webhoookami** oraz **Zarządzanie kanałami**
                    - Nie masz permisji administratora
                    - Nie jesteś właścicielem serwera
                    - Bot nie ma permisji administrotara lub uprawnień **Zarządzanie Webhookami**, **Zarządzanie wiadomościami** oraz **Wysyłanie wiadomości**
                    - Nie jesteś w drużynie **mysterY**`
                    .split("\n")
                    .map((x) => x.trim())
                    .join("\n"),
            })

        //sprawdzanie widoczności kanału
        if (!channel.channel || !channel.channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
            return interaction.editReply(`${customEmoticons.denided} Kanał jest niedostępny! Czy na pewno mam do niego dostęp?`)
        }

        //wczytywanie danych
        var allsnpsht = db.get(`serverData/${interaction.guildId}/gc`)
        var gccount = allsnpsht.exists ? Object.keys(gcdataGuild.encode(allsnpsht.val ?? "")).length : 0

        if (gccount >= 3 + 4 * constPremiumServersIDs.includes(interaction.guildId) && interaction.guildId !== supportServer.id) {
            return interaction.editReply(`${customEmoticons.denided} Przekroczony został limit ustawionych stacji!`)
        }

        var $stacja = interaction.options.get("stacja", true).value
        // Daj listę stacji
        var stationData = db.get(`stations/${$stacja}`).val

        if (!stationData) {
            return interaction.editReply(`${customEmoticons.denided} Nie ma takiej stacji!`)
        }

        var serverData = Object.values(db.get("serverData").val || {})
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

        db.set(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))

        db.set(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))

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
