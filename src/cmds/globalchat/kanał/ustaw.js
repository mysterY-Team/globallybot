const { CommandInteraction, Client, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const { db, ownersID, customEmoticons, _bot, supportServers, debug, constPremiumServersIDs } = require("../../../config")
const { gcdataGuild } = require("../../../functions/dbs")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const supportButton = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Bądź na bieżąco z botem!").setURL("https://discord.gg/7S3P2DUwAm")
        const pwd = interaction.options.get("passwd")?.value

        if (debug && !ownersID.includes(interaction.user.id))
            return interaction.reply({
                ephemeral: true,
                content: "Komenda jest niestety wyłączona dla każdego; bot przeszedł właśnie w tryb debugowania i trwają prace nad nim. Przepraszamy za utrudnienia!",
                components: [new ActionRowBuilder({ components: [supportButton] })],
            })
        if (interaction.guildId == null) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)

        //argument kanału i serwer
        var channel = interaction.options.get("kanał", true)
        var guild = interaction.guild
        var bot = guild.members.cache.get(_bot.id)
        if (
            !(
                (interaction.member.permissions.has(PermissionFlagsBits.ManageWebhooks & PermissionFlagsBits.ManageChannels) ||
                    interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
                    interaction.user.id == guild.ownerId ||
                    ownersID.includes(interaction.user.id)) &&
                (bot.permissions.has(PermissionFlagsBits.Administrator) || bot.permissions.has(PermissionFlagsBits.ManageWebhooks))
            )
        )
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:
                    - Nie masz obu uprawnień: **Zarządzanie webhoookami** oraz **Zarządzanie kanałami**
                    - Nie masz permisji administratora
                    - Nie jesteś właścicielem serwera
                    - Bot nie ma permisji administrotara lub uprawnienia **Zarządzanie Webhookami**
                    - Nie jesteś na liście developerów bota`
                    .split("\n")
                    .map((x) => x.trim())
                    .join("\n"),
            })

        await interaction.deferReply({ ephemeral: Boolean(pwd) })
        //sprawdzanie widoczności kanału

        if (!channel.channel || !channel.channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.ViewChannel)) {
            return interaction.editReply(`${customEmoticons.denided} Kanał jest niedostępny! Czy na pewno mam do niego dostęp?`)
        }

        //wczytywanie danych
        var allsnpsht = db.get(`serverData/${interaction.guildId}/gc`)
        allsnpsht.val ??= ""
        var gccount = allsnpsht.exists ? Object.keys(gcdataGuild.encode(allsnpsht.val)).length : 0

        if (gccount >= 3 + 4 * constPremiumServersIDs.includes(interaction.guildId) && !supportServers.includes(interaction.guildId)) {
            return interaction.editReply(`${customEmoticons.denided} Przekroczony został limit ustawionych stacji!`)
        }

        var $stacja = interaction.options.get("stacja", true).value
        // Daj listę stacji
        var stationData = db.get(`stations/${$stacja}`).val

        if (!stationData) {
            return interaction.editReply(`${customEmoticons.denided} Nie ma takiej stacji!`)
        }

        stationData = stationData.split("|")
        if (!pwd && stationData[1]) {
            return interaction.editReply(`${customEmoticons.info} Ta stacja wymaga użycia argumentu \`passwd\``)
        }
        if (stationData[1] && pwd !== stationData[1]) {
            return interaction.editReply(`${customEmoticons.denided} Niepoprawne hasło!`)
        }

        var _bool = allsnpsht.val.includes(channel.value)

        var data = gcdataGuild.encode(allsnpsht.val)
        if (data[$stacja]?.channel == channel.value) return interaction.editReply(`${customEmoticons.denided} Na tym kanale jest już ustawiony GlobalChat o tej stacji!`)

        if (_bool) {
            return interaction.editReply(`${customEmoticons.denided} Ten kanał ma już odrębną stację!`)
        }

        data[$stacja] = {
            channel: channel.value,
            webhook: "none",
            timestamp: data[$stacja]?.timestamp ?? Date.now() - 1,
        }

        db.set(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))
        //informacja o zapisie
        if (!_bool) interaction.editReply(`${customEmoticons.approved} Dodano pomyślnie kanał na stacji \`${$stacja}\`!`)
        else {
            interaction.editReply(
                `${customEmoticons.info} Jako że ten serwer już miał ustawiony kanał GlobalChata na kanale <#${data.channel}> (stacja \`${$stacja}\`), spowodowało to nadpis na nowy kanał.`
            )
        }
    },
}
