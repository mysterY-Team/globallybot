const { Client, ButtonInteraction, ChannelType } = require("discord.js")
const { customEmoticons, db } = require("../config")
const { gcdata } = require("../functions/dbs")
const { listenerLog } = require("../functions/useful")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        if (args[0] !== interaction.user.id) {
            return interaction.reply({
                content: `${customEmoticons.denided} Nie jesteś właścicielem wiadomości!`,
                ephemeral: true,
            })
        }
        const comp = interaction.message.components
        await interaction.deferReply({
            ephemeral: true,
        })
        const msgid = interaction.message.id
        const snpsht = db.get(`userData/${interaction.user.id}/gc`)
        var data = gcdata.encode(snpsht.val)

        data.messagesToDelete = data.messagesToDelete.split("|")
        console.log(`${interaction.guildId}/${interaction.channelId}/${msgid}\n${data.messagesToDelete}`)
        if (!data.messagesToDelete.includes(`${interaction.guildId}/${interaction.channelId}/${msgid}`)) {
            interaction.editReply("Możliwość usunięcia tej wiadomości wygasła!")
            return
        }

        interaction.editReply(`${customEmoticons.loading} Usuwanie...`)

        await Promise.all(
            data.messagesToDelete.map(async (location, i) => {
                listenerLog(4, `Lokalizacja nr. ${i}`)
                location = location.split("/")

                try {
                    const server = await client.guilds.fetch(location[0])
                    listenerLog(5, `Serwer istnieje`)
                    const channel = await server.channels.fetch(location[1])
                    if (channel && channel.type === ChannelType.GuildText) {
                        listenerLog(5, `Kanał istnieje`)
                        const message = await channel.messages.fetch(location[2])
                        if (message) listenerLog(5, `Wiadomość istnieje`)
                        if (message?.deletable) message.delete()
                    }
                } catch (e) {}

                return
            })
        )
        interaction.editReply(`${customEmoticons.approved} Usunięto pomyślnie!`)
    },
}
