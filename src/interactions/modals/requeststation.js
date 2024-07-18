const { Client, ModalSubmitInteraction, EmbedBuilder } = require("discord.js")
const { db, customEmoticons, supportServer, ownersID } = require("../../config")
const { gcdataGuild } = require("../../functions/dbs")

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

        var stations = db.get(`stations`).val ?? {}

        if (Object.values(stations).find((x) => x.startsWith(interaction.user.id)) && !ownersID.includes(interaction.user.id))
            return interaction.editReply(`${customEmoticons.denided} Już jesteś właścicielem jakiejś stacji!`)

        if (Object.keys(stations).includes(modalArgs.id)) return interaction.editReply(`${customEmoticons.denided} Już istnieje taka stacja!`)

        db.set(`stations/${modalArgs.id}`, `${interaction.user.id}|${modalArgs.passwd}`)

        const emb = new EmbedBuilder()
            .setTitle("Nowa stacja!")
            .setDescription(`ID: \`${modalArgs.id}\`\nHasłowane: ${modalArgs.passwd ? customEmoticons.approved : customEmoticons.denided}\nKreator: <@${interaction.user.id}>`)
            .setColor("Fuchsia")
        await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send({ embeds: [emb] })

        interaction.editReply(`${customEmoticons.approved} Utworzono stację poprawnie!`)
    },
}
