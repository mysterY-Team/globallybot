const { Client, ButtonInteraction, ChannelType, EmbedBuilder } = require("discord.js")
const { customEmoticons, db, ownersID, supportServer } = require("../config")
const { gcdata } = require("../functions/dbs")
const { listenerLog } = require("../functions/useful")
const { lastUserHandler } = require("../globalchat")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply({
            ephemeral: true,
        })
        var $channel = await client.channels.fetch(supportServer.gclogID)
        if ($channel && $channel.type == ChannelType.GuildText) {
            try {
                var $message = await $channel.messages.fetch(args[1])
                var messagesToDelete = $message.content.split("|")
                var stationWhereItIsSent = $message.embeds[0].footer.text
            } catch (err) {
                interaction.editReply("Możliwość usunięcia tej wiadomości wygasła!")
                return
            }
        } else {
            interaction.editReply("Możliwość usunięcia tej wiadomości wygasła!")
            return
        }

        var lastUser = lastUserHandler.get()
        if (lastUser === `${interaction.guildId}/${interaction.channelId}:${args[0]}[true]`) {
            lastUserHandler.reset()
        }

        var snpsht = db.get(`stations/${stationWhereItIsSent}`)
        if (args[0] !== interaction.user.id && (!snpsht.exists || !snpsht.val.startsWith(interaction.user.id)) && data.modPerms === 0 && !ownersID.includes(interaction.user.id)) {
            return interaction.editReply({
                content: `${customEmoticons.denided} Nie jesteś właścicielem wiadomości/stacji/bota lub moderatorem GC!`,
                ephemeral: true,
            })
        }

        await interaction.editReply(`${customEmoticons.loading} Usuwanie...`)
        {
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

                return
            })
        )

        if (args[0] !== interaction.user.id) {
            var data = gcdata.encode(db.get(`userData/${interaction.user.id}/gc`).val)
            data.timestampToSendMessage = Math.max(data.timestampToSendMessage + 3000, Date.now() + 5000)
            data.karma--
            db.set(`userData/${interaction.user.id}/gc`, gcdata.decode(data))
        }

        {
            let embeds = $message.embeds
            let embed = new EmbedBuilder($message.embeds[0]).setFields({ name: "Stan", value: `Usunięto <t:${Math.floor(Date.now() / 1000)}:R>` }).setColor("Red")
            embeds[0] = embed
            await $message.edit({ content: "", embeds })
        }

        interaction.editReply(`${customEmoticons.approved} Usunięto pomyślnie!`)
    },
}
