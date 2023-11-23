const { CommandInteraction, Client, PermissionFlagsBits, WebhookClient } = require("discord.js")
const { getDatabase, ref, get, remove } = require("@firebase/database")
const { firebaseApp, ownersID, customEmoticons } = require("../config")
const { default: axios } = require("axios")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.guildId == null) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)
        var guild = client.guilds.cache.get(interaction.guildId)

        if (
            !(
                interaction.member.permissions.has(PermissionFlagsBits.ManageWebhooks & PermissionFlagsBits.ManageChannels) ||
                interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
                interaction.user.id == guild.ownerId ||
                ownersID.includes(interaction.user.id)
            )
        )
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:\n- Nie masz obu uprawnień: **Zarządzanie webhoookami** oraz **Zarządzanie kanałami**\n- Nie masz permisji administratora\n- Nie jesteś właścicielem serwera\n- Nie jesteś na liście developerów bota`,
            })

        interaction.deferReply().then(() => {
            get(ref(getDatabase(firebaseApp), `globalchat/channels/${interaction.guildId}`)).then((snapshot) => {
                if (!snapshot.exists()) return interaction.editReply(`${customEmoticons.denided} Nie ma ustawionego kanału!`)

                var webhook = new WebhookClient({ url: snapshot.val().webhook })

                axios
                    .get(snapshot.val().webhook)
                    .then((res) => {
                        try {
                            if (res.status >= 200 && res.status < 300) webhook.delete("użycia komendy /GLOBALCHAT")
                        } catch (e) {}

                        remove(ref(getDatabase(firebaseApp), `globalchat/channels/${interaction.guildId}`)).then(() => {
                            interaction.editReply(`${customEmoticons.approved} Usunięto kanał z bazy danych!`)
                        })
                    })
                    .catch((err) => {
                        remove(ref(getDatabase(firebaseApp), `globalchat/channels/${interaction.guildId}`)).then(() => {
                            interaction.editReply(`${customEmoticons.approved} Usunięto kanał z bazy danych!`)
                        })
                    })
            })
        })
    },
}
