const { CommandInteraction, Client, PermissionFlagsBits, WebhookClient } = require("discord.js")
const { db, ownersID, customEmoticons, _bot } = require("../../../config")
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

        await interaction.deferReply()
        var snapshot = db.get(`serverData/${interaction.guildId}/gc/${interaction.options.get("stacja", true).value}`)
        if (!snapshot.exists) return interaction.editReply(`${customEmoticons.denided} Nie ma ustawionego kanału na tej stacji!`)

        function removeData() {
            db.delete(`serverData/${interaction.guildId}/gc/${interaction.options.get("stacja", true).value}`)
            interaction.editReply(`${customEmoticons.approved} Usunięto kanał z bazy danych!`)
        }

        var data = snapshot.val

        var channel = interaction.guild.channels.cache.get(data.channel)

        if (typeof channel !== "undefined" && data.webhook !== "none") {
            var webhook = new WebhookClient({
                url: "https://discord.com/api/webhooks/" + data.webhook,
            })
            axios
                .get(data.webhook)
                .then((res) => {
                    try {
                        if (res.status >= 200 && res.status < 300) webhook.delete("użycia komendy /GLOBALCHAT")
                    } catch (e) {}

                    removeData()
                })
                .catch(() => {
                    removeData()
                })
        } else {
            removeData()
        }
    },
}
