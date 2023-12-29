const { CommandInteraction, Client, PermissionFlagsBits, WebhookClient } = require("discord.js")
const { getDatabase, ref, get, remove } = require("@firebase/database")
const { firebaseApp, ownersID, customEmoticons, botID } = require("../../../config")
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
                    - Bot nie ma permisji administrotara lub uprawnienia **Zarządzanie Webhookami**
                    - Nie jesteś na liście developerów bota`
                    .split("\n")
                    .map((x) => x.trim())
                    .join("\n"),
            })

        interaction.deferReply().then(() => {
            get(ref(getDatabase(firebaseApp), `serverData/${interaction.guildId}/gc/${interaction.options.get("stacja", true).value}`)).then((snapshot) => {
                if (!snapshot.exists()) return interaction.editReply(`${customEmoticons.denided} Nie ma ustawionego kanału na tej stacji!`)

                var webhook = new WebhookClient({ url: snapshot.val().webhook })

                axios
                    .get(snapshot.val().webhook)
                    .then((res) => {
                        try {
                            if (res.status >= 200 && res.status < 300) webhook.delete("użycia komendy /GLOBALCHAT")
                        } catch (e) {}

                        remove(ref(getDatabase(firebaseApp), `serverData/${interaction.guildId}/gc`)).then(() => {
                            interaction.editReply(`${customEmoticons.approved} Usunięto kanał z bazy danych!`)
                        })
                    })
                    .catch(() => {
                        remove(ref(getDatabase(firebaseApp), `serverData/${interaction.guildId}/gc`)).then(() => {
                            interaction.editReply(`${customEmoticons.approved} Usunięto kanał z bazy danych!`)
                        })
                    })
            })
        })
    },
}
