const {
    CommandInteraction,
    Client,
    PermissionFlagsBits,
} = require("discord.js")
const { getDatabase, ref, get, set } = require("@firebase/database")
const { firebaseApp, ownersID, customEmoticons } = require("../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.guildId == null)
            return interaction.reply(
                `${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`,
            )

        //argument kanału i serwer
        var channel = interaction.options.get("kanał", true)
        var guild = client.guilds.cache.get(interaction.guildId)
        if (
            !(
                interaction.member.permissions.has(
                    PermissionFlagsBits.ManageWebhooks &
                        PermissionFlagsBits.ManageChannels,
                ) ||
                interaction.member.permissions.has(
                    PermissionFlagsBits.Administrator,
                ) ||
                interaction.user.id == guild.ownerId ||
                ownersID.includes(interaction.user.id)
            )
        )
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:
                    - Nie masz obu uprawnień: **Zarządzanie webhoookami** oraz **Zarządzanie kanałami**
                    - Nie masz permisji administratora
                    - Nie jesteś właścicielem serwera
                    - Nie jesteś na liście developerów bota`,
            })

        interaction
            .reply(
                `${customEmoticons.loading} Wczytywanie wyniku z bazy danych...`,
            )
            .then(() => {
                //wczytywanie danych
                get(
                    ref(
                        getDatabase(firebaseApp),
                        `globalchat/channels/${interaction.guildId}`,
                    ),
                ).then((snapshot) => {
                    //sprawdzanie, czy już jest w bazie danych serwer i czy zawiera ten kanał bazie
                    var _bool = snapshot.exists()

                    if (_bool && snapshot.val() == channel.value)
                        return interaction.editReply(
                            `${customEmoticons.denided} Na tym kanale jest już globalchat!`,
                        )

                    //zapis danych
                    interaction.editReply(
                        `${customEmoticons.loading} Zapisywanie danych...`,
                    )
                    set(
                        ref(
                            getDatabase(firebaseApp),
                            `globalchat/channels/${interaction.guildId}`,
                        ),
                        channel.value,
                    ).then(() => {
                        //informacja o zapisie
                        if (!_bool)
                            interaction.editReply(
                                `${customEmoticons.approved} Dodano pomyślnie kanał!`,
                            )
                        else
                            interaction.editReply(
                                `${
                                    customEmoticons.info
                                } Jako że ten serwer już miał ustawiony kanał GlobalChata na kanale <#${snapshot.val()}>, spowodowało to nadpis na nowy kanał`,
                            )
                    })
                })
            })
    },
}
