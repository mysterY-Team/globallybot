const { CommandInteraction, Client, PermissionFlagsBits, WebhookClient } = require("discord.js")
const { getDatabase, ref, get, set } = require("@firebase/database")
const { firebaseApp, ownersID, customEmoticons, botID } = require("../../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.guildId == null) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)

        //argument kanału i serwer
        var channel = interaction.options.get("kanał", true)
        var guild = client.guilds.cache.get(interaction.guildId)
        var cl_channel = guild.channels.cache.get(channel.value)
        var bot = guild.members.cache.get(botID)
        if (
            !(
                (interaction.member.permissions.has(PermissionFlagsBits.ManageWebhooks & PermissionFlagsBits.ManageChannels) ||
                    interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
                    interaction.user.id == guild.ownerId ||
                    ownersID.includes(interaction.user.id)) &&
                bot.permissions.has(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageWebhooks)
            )
        )
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:
                    - Nie masz obu uprawnień: **Zarządzanie webhoookami** oraz **Zarządzanie kanałami**
                    - Nie masz permisji administratora
                    - Nie jesteś właścicielem serwera
                    - Bot nie ma odpowiednich permisji administrotara lub uprawnienia **Zarządzanie Webhookami**
                    - Nie jesteś na liście developerów bota`
                    .split("\n")
                    .map((x) => x.trim())
                    .join("\n"),
            })

        interaction.deferReply().then(() => {
            //wczytywanie danych
            get(ref(getDatabase(firebaseApp), `globalchat/channels/${interaction.guildId}`)).then((snapshot) => {
                //sprawdzanie, czy już jest w bazie danych serwer i czy zawiera ten kanał bazie
                var _bool = snapshot.exists()
                var data = snapshot.val()

                if (_bool && data.channel == channel.value) return interaction.editReply(`${customEmoticons.denided} Na tym kanale jest już globalchat!`)

                set(ref(getDatabase(firebaseApp), `globalchat/channels/${interaction.guildId}`), {
                    channel: channel.value,
                    webhook: "https://patyczakus.github.io",
                }).then(() => {
                    //informacja o zapisie
                    if (!_bool) interaction.editReply(`${customEmoticons.approved} Dodano pomyślnie kanał!`)
                    else {
                        interaction.editReply(
                            `${customEmoticons.info} Jako że ten serwer już miał ustawiony kanał GlobalChata na kanale <#${data.channel}>, spowodowało to nadpis na nowy kanał`
                        )
                    }
                })
            })
        })
    },
}
