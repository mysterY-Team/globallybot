const { CommandInteraction, Client, PermissionFlagsBits, WebhookClient, EmbedBuilder } = require("discord.js")
const { db, ownersID, customEmoticons, _bot, supportServer } = require("../../../config")

const { gcdataGuild } = require("../../../functions/dbs")
const { request } = require("undici")

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

        var channel = interaction.options.get("kanał", true)

        if (
            !(
                (interaction.member.permissions.has(PermissionFlagsBits.ManageWebhooks + PermissionFlagsBits.ManageChannels) ||
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
        var snapshot = db.get(`serverData/${interaction.guildId}/gc`)
        var key = Object.entries(gcdataGuild.encode(snapshot.val ?? "")).find((x) => x[1].channel === channel.channel.id)
        if (!key) return interaction.editReply(`${customEmoticons.denided} Nie ma podpiętej stacji na tym kanale`)

        var $stacja = key[0]

        var data = gcdataGuild.encode(snapshot.val)

        async function removeData() {
            delete data[$stacja]
            if (Object.keys(data).length > 0) db.set(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))
            else db.delete(`serverData/${interaction.guildId}/gc`)
            interaction.editReply(`${customEmoticons.approved} Usunięto kanał z bazy danych!`)

            const emb = new EmbedBuilder()
                .setTitle("Usunięto kanał!")
                .setDescription(
                    `ID: \`${channel.channel.id}\`\nNazwa kanału: \`${channel.channel.name}\`\nStacja: \`${$stacja}\`\nOsoba odłączająca: <@${interaction.user.id}> (\`${interaction.user.username}\`, \`${interaction.user.id}\`)`
                )
                .setColor("Blue")
            await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send({ embeds: [emb] })
        }

        if (channel.channel && data[$stacja].webhook !== "none") {
            var webhook = new WebhookClient({
                url: "https://discord.com/api/webhooks/" + data[$stacja].webhook,
            })
            request("https://discord.com/api/webhooks/" + data[$stacja].webhook)
                .then((res) => {
                    try {
                        if (res.statusCode >= 200 && res.statusCode < 300) webhook.delete("użycia komendy /GLOBALCHAT")
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
