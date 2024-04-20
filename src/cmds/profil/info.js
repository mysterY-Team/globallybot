const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { getDatabase, ref, get, set } = require("@firebase/database")
const { firebaseApp, customEmoticons, _bot, ownersID, GCmodsID } = require("../../config")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const user = interaction.options.getUser("osoba") || interaction.user

        await interaction.deferReply()
        const fdb = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${user.id}`))
        var data = fdb.val() ?? {}
        const modules = Object.keys(data).map((x) => {
            const _x = {
                gc: "GlobalChat",
            }
            return _x[x] || x
        })

        var embed = new EmbedBuilder()
            .setAuthor({
                iconURL: user.avatarURL({ size: 32, extension: "webp" }),
                name: `${user.displayName} (${user.discriminator === "0" ? user.username : `${user.username}#${user.discriminator}`})`,
            })
            .setFields({
                name: "Informacje o użytkowniku",
                value: `Założenie konta: <t:${Math.floor(user.createdTimestamp / 1000)}:R>\nID: \`${user.id}\`\nWłaściciel bota: ${
                    ownersID.includes(user.id) ? customEmoticons.approved : customEmoticons.denided
                }`,
            })

        if (!user.bot && !user.system) {
            if (modules.length > 0) embed.addFields({ name: "Podpięte moduły", value: modules.join("\n") })
            if (modules.includes("GlobalChat"))
                embed.addFields({
                    name: "Moduł *GlobalChat*",
                    value: `Moderator: ${ownersID.includes(user.id) || GCmodsID.includes(user.id) ? customEmoticons.approved : customEmoticons.denided}\nZablokowany: ${
                        data.gc.block.is ? customEmoticons.approved : customEmoticons.denided
                    }`,
                })
        }

        return interaction.editReply({ embeds: [embed] })
    },
}