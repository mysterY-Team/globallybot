const { Client, ModalSubmitInteraction, EmbedBuilder } = require("discord.js")
const { db, customEmoticons, supportServer } = require("../../config")
const { checkUserStatusInSupport, wait } = require("../../functions/useful")

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

        await interaction.deferReply()
        const ssstatus = await checkUserStatusInSupport(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.in && ssstatus.mysteryTeam

        if (modalArgs.id.match(/[^a-z0-9_-]/g)) {
            interaction.editReply(`${customEmoticons.denided} ID zawiera niedozwolone znaki!`)
            setTimeout(() => interaction.deleteReply(), 5000);
        } else {

            if (modalArgs.passwd.match(/[^a-zA-Z0-9._@!]/g)) {
                interaction.editReply(`${customEmoticons.denided} Hasło zawiera niedozwolone znaki!`)
                setTimeout(() => interaction.deleteReply(), 5000);
            } else {


                var stations = db.get(`stations`).val ?? {}

                if (Object.values(stations).find((x) => x.startsWith(interaction.user.id)) && !isInMysteryTeam) {
                    interaction.editReply(`${customEmoticons.denided} Już jesteś właścicielem jakiejś stacji!`)
                    setTimeout(() => interaction.deleteReply(), 3000);
                } else {


                    if (Object.keys(stations).includes(modalArgs.id)) {
                        interaction.editReply(`${customEmoticons.denided} Już istnieje taka stacja!`);
                        setTimeout(() => interaction.deleteReply(), 3000)

                    } else {
                        db.set(`stations/${modalArgs.id}`, `${interaction.user.id}|${modalArgs.passwd}`)
                        const emb = new EmbedBuilder()
                            .setTitle("Nowa stacja!")
                            .setDescription(`ID: \`${modalArgs.id}\`\nHasłowane: ${modalArgs.passwd ? customEmoticons.approved : customEmoticons.denided}\nKreator: <@${interaction.user.id}>`)
                            .setColor("Fuchsia")
                        await (await (await client.guilds.fetch(supportServer.id)).channels.fetch(supportServer.gclogs.main)).send({ embeds: [emb] })

                        await interaction.editReply(`${customEmoticons.approved} Utworzono stację poprawnie!`)
                        setTimeout(() => interaction.deleteReply(), 3000)
                    }
                }
            }
        }

    },
}
