const { Client, ButtonInteraction, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { customEmoticons, db, supportServer } = require("../../../config")
const { gcdata } = require("../../../functions/dbSystem")
const { listenerLog, checkUserStatus, botPremiumInfo } = require("../../../functions/useful")
const { lastUserHandler } = require("../../../globalchat")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} argss
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply({
            ephemeral: true,
        })

        const ssstatus = await checkUserStatus(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam
        const premium = botPremiumInfo(interaction.user.id, ssstatus)

        var $channels = [await client.channels.fetch(supportServer.gclogs.msg), await client.channels.fetch(supportServer.gclogs.main)]
        if ($channels[0] && $channels[0].type == ChannelType.GuildText) {
            try {
                var $message = await $channels[0].messages.fetch(args[1])
                var messagesToDelete = $message.content.split("|")
                var stationWhereItIsSent = $message.embeds[0].footer.text
            } catch (err) {
                console.log(err)
                interaction.editReply("Możliwość usunięcia tej wiadomości wygasła!")
                return
            }
        } else {
            interaction.editReply("Możliwość usunięcia tej wiadomości wygasła!")
            return
        }

        var data = gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val)
        var lastUser = lastUserHandler.get()
        if (lastUser === `${interaction.guildId}/${interaction.channelId}:${args[0]}[true]`) {
            lastUserHandler.reset()
        }

        var snpsht = db.get(`stations/${stationWhereItIsSent}`)
        if (args[0] !== interaction.user.id && (!snpsht.exists || !snpsht.val.includes(interaction.user.id)) && data.modPerms === 0 && !isInMysteryTeam) {
            return interaction.editReply({
                content: `${customEmoticons.denided} Nie masz permisji do usunięcia tej wiadodmości!`,
                ephemeral: true,
            })
        }

        var stationHasPasswd = Boolean(snpsht.val.split("|")[1])

        await interaction.editReply(`${customEmoticons.loading} Usuwanie...`)
        if (!stationHasPasswd) {
            let embeds = $message.embeds
            let embed = new EmbedBuilder($message.embeds[0]).setFields({ name: "Stan", value: "Usuwanie" }).setColor("Orange")
            embeds[0] = embed
            await $message.edit({ embeds })
        }

        await Promise.all(
            messagesToDelete.map(async (location, i) => {
                listenerLog(4, `Lokalizacja nr. ${i}`)
                location = location.split("/")

                try {
                    const server = await client.guilds.fetch(location[0])
                    listenerLog(5, `Serwer istnieje`)
                    const channel = await server.channels.fetch(location[1])
                    if (channel && channel.type === ChannelType.GuildText) {
                        listenerLog(5, `Kanał istnieje`)
                        const message = await channel.messages.fetch(location[2])
                        if (message?.deletable) {
                            listenerLog(5, `Wiadomość istnieje i jest możliwa do usunięcia`)
                            await message.delete()
                        }
                    }
                } catch (e) {}

                return "ok"
            })
        )

        if (args[0] === interaction.user.id && !premium.have && !isInMysteryTeam) {
            data = gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val)
            data.timestampToSendMessage = Math.max(data.timestampToSendMessage, Date.now()) + messagesToDelete.length * 250
            data.karma -= BigInt(1 + (data.karma >= 100n && data.modPerms == 0) * 2)
            if (data.karma < 0) data.karma = 0n
            db.set(`userData/${interaction.user.id}/gc`, gcdata.decode(data))
        }

        const firstEmbed = $message.embeds[0]
        if (!stationHasPasswd) {
            {
                const embeds = $message.embeds
                embeds[0] = new EmbedBuilder()
                    .setAuthor({ iconURL: firstEmbed.author.iconURL, name: firstEmbed.author.name })
                    .setTitle("Usunięta wiadomość")
                    .setDescription(firstEmbed.description)
                    .setColor("Red")
                    .setFooter({ text: firstEmbed.footer.text })
                if ($channels[1] && $channels[1].type == ChannelType.GuildText)
                    await $channels[1].send({
                        embeds,
                        components: [
                            new ActionRowBuilder().setComponents(
                                new ButtonBuilder($message.components[0].components[0].toJSON()),
                                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${args[0]}`).setEmoji(`👤`)
                            ),
                        ],
                    })
            }
            {
                const embeds = $message.embeds
                let embed = new EmbedBuilder(firstEmbed).setFields({ name: "Stan", value: `Usunięto <t:${Math.floor(Date.now() / 1000)}:R>` }).setColor("Red")
                embeds[0] = embed
                await $message.edit({
                    content: "",
                    embeds,
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder($message.components[0].components[0].toJSON()),
                            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`gcui\u0000${args[0]}`).setEmoji(`👤`)
                        ),
                    ],
                })
            }
        } else {
            await $message.edit({
                content: "",
                embeds: [firstEmbed],
                components: [],
            })
        }

        try {
            interaction.editReply(`${customEmoticons.approved} Usunięto pomyślnie!`)
        } catch (e) {}
    },
}
