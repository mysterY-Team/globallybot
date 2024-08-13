const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, customEmoticons } = require("../../config")
const { gcdata } = require("../../functions/dbs")
const { checkUserStatusInSupport } = require("../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const user = interaction.options.get("osoba")?.user || interaction.user

        await interaction.deferReply()
        const ssstatus = await checkUserStatusInSupport(client, interaction.user.id)
        const isInMysteryTeam = ssstatus.in && ssstatus.mysteryTeam 

        const fdb = db.get(`userData/${user.id}`)
        var data = fdb.val ?? {}
        const modules = Object.keys(data).map((x) => {
            const _x = {
                gc: "GlobalChat",
                imaca: "ImaCarrrd",
            }
            return _x[x] || x
        })

        var embed = new EmbedBuilder()
            .setAuthor({
                iconURL: user.displayAvatarURL({ size: 32, extension: "webp" }),
                name: `${user.displayName} (${user.discriminator === "0" ? user.username : `${user.username}#${user.discriminator}`})`,
            })
            .setFields({
                name: "Informacje o użytkowniku",
                value: `Założenie konta: <t:${Math.floor(user.createdTimestamp / 1000)}:R>\nID: \`${user.id}\`\nW drużynie **mysterY Team**: ${
                    isInMysteryTeam ? customEmoticons.approved : customEmoticons.denided
                }`,
            })

        if (!user.bot && !user.system) {
            if (modules.length > 0) embed.addFields({ name: "Podpięte moduły", value: modules.join("\n") })
            if (modules.includes("GlobalChat")) {
                data.gc = gcdata.encode(data.gc)
                embed.addFields({
                    name: "Moduł *GlobalChat*",
                    value: `Moderator: ${isInMysteryTeam || data.gc.modPerms > 0 ? customEmoticons.approved : customEmoticons.denided}\nZablokowany: ${
                        data.gc.isBlocked ? customEmoticons.approved : customEmoticons.denided
                    }\nKarma: **${data.gc.karma.toString()}**`,
                })
            }
        }

        return interaction.editReply({ embeds: [embed] })
    },
}
