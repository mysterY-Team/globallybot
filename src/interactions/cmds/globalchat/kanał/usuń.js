import djs from "discord.js"
const { ChatInputCommandInteraction, Client, PermissionFlagsBits, WebhookClient, EmbedBuilder, InteractionContextType } = djs

import conf from "../../../../config.js"
const { db, customEmoticons, _bot, supportServer } = conf
import { gcdataGuild } from "../../../../functions/dbSystem.js"
import { request } from "undici"
import { checkUserStatus } from "../../../../functions/useful.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.context != InteractionContextType.Guild) return interaction.reply(`${customEmoticons.denided} Nie możesz wykonać tej funkcji w prywatnej konserwacji!`)
        var guild = client.guilds.cache.get(interaction.guildId)
        var bot = guild.members.cache.get(_bot.id)

        var channel = interaction.options.get("kanał", true)

        await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        const botPerms = bot.permissions
        const userPerms = interaction.member.permissions
        if (
            !(userPerms.has(PermissionFlagsBits.ManageWebhooks) && userPerms.has(PermissionFlagsBits.ManageChannels)) &&
            !userPerms.has(PermissionFlagsBits.Administrator) &&
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
        if (!botPerms.has(PermissionFlagsBits.Administrator) && !botPerms.has("ManageWebhooks"))
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.editReply({
                content: `${customEmoticons.denided} Bot potrzebuje permisji admina lub uprawnienia **Zarządzanie webhookami**`,
            })

        var snapshot = await db.aget(`serverData/${interaction.guildId}/gc`)
        var key = Object.entries(gcdataGuild.encode(snapshot.val ?? "")).find((x) => x[1].channel === channel.channel.id)
        if (!key) return interaction.editReply(`${customEmoticons.denided} Nie ma podpiętej stacji na tym kanale`)

        var $stacja = key[0]

        var data = gcdataGuild.encode(snapshot.val)

        async function removeData() {
            delete data[$stacja]
            if (Object.keys(data).length > 0) await db.aset(`serverData/${interaction.guildId}/gc`, gcdataGuild.decode(data))
            else await db.adelete(`serverData/${interaction.guildId}/gc`)
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
                        if (res.statusCode >= 200 && res.statusCode < 300) webhook.delete("użycia komendy /globalchat.js")
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
