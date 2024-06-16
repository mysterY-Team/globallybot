const { Client, ModalSubmitInteraction, ChannelType, channelLink } = require("discord.js")
const { db, customEmoticons, supportServers, _bot, ownersID } = require("../config")
const { gcdataGuild } = require("../functions/dbs")

module.exports = {
    /**
     * @param {Client} client
     * @param {ModalSubmitInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        const modalArgs = {
            id: interaction.fields.getTextInputValue("id"),
            passwd: interaction.fields.getTextInputValue("passwd"),
        }

        if (modalArgs.id.match(/[^a-z0-9_-]/g)) return interaction.reply(`${customEmoticons.denided} ID zawiera niedozwolone znaki!`)

        if (modalArgs.passwd.match(/[^a-zA-Z0-9._@!]/g)) return interaction.reply(`${customEmoticons.denided} Hasło zawiera niedozwolone znaki!`)

        await interaction.deferReply()
        const catid = {
            public: "1251840847901757441",
            private: "1251840967489749055",
        }

        var stations = db.get(`stations`).val ?? {}

        if (Object.values(stations).find((x) => x.startsWith(interaction.user.id)) && !ownersID.includes(interaction.user.id))
            return interaction.editReply(`${customEmoticons.denided} Już jesteś właścicielem jakiejś stacji!`)

        if (Object.keys(stations).includes(modalArgs.id)) return interaction.editReply(`${customEmoticons.denided} Już istnieje taka stacja!`)

        var s = gcdataGuild.encode(db.get(`serverData/${supportServers[1]}/gc`).val ?? "")
        db.set(`stations/${modalArgs.id}`, `${interaction.user.id}|${modalArgs.passwd}`)
        const x = await (
            await client.guilds.fetch(supportServers[1])
        ).channels.create({
            type: ChannelType.GuildText,
            name: modalArgs.id,
            parent: modalArgs.passwd ? catid.private : catid.public,
            topic: `Stacja stworzona przez <@${interaction.user.id}> w bocie <@${_bot.id}>`,
        })
        s[modalArgs.id] = { channel: x.id }
        db.set(`serverData/${supportServers[1]}/gc`, gcdataGuild.decode(s))

        interaction.editReply(`${customEmoticons.approved} Utworzono stację poprawnie!`)
    },
}
