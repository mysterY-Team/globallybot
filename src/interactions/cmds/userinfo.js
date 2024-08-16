const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { db, customEmoticons } = require("../../config")
const { gcdata } = require("../../functions/dbs")
const { checkUserStatusInSupport, getModules } = require("../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const user = interaction.options.get("osoba")?.user || interaction.user

        await interaction.deferReply()
        const ssstatus = await checkUserStatusInSupport(client, user.id)
        const isInMysteryTeam = ssstatus.in && ssstatus.mysteryTeam

        const fdb = db.get(`userData/${user.id}`)
        var data = fdb.val ?? {}
        const premium = (data.premium ?? 0) > 0
        const modules = getModules(data)

        var embed = new EmbedBuilder()
            .setAuthor({
                iconURL: user.displayAvatarURL({ size: 32, extension: "webp" }),
                name: `${user.displayName} (${user.discriminator === "0" ? user.username : `${user.username}#${user.discriminator}`})`,
            })
            .setFields({
                name: "Informacje o użytkowniku",
                value: [
                    `Założenie konta: <t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
                    `ID: \`${user.id}\``,
                    `W drużynie **mysterY Team**: ${isInMysteryTeam ? customEmoticons.approved : customEmoticons.denided}`,
                    `Premium: ${isInMysteryTeam ? "[ nie dotyczy ]" : premium ? customEmoticons.denided : customEmoticons.approved}`,
                ].join("\n"),
            })

        if (!user.bot && !user.system) {
            if (modules.length > 0) embed.addFields({ name: "Podpięte moduły", value: modules.join("\n") })
            if (modules.includes("GlobalChat")) {
                data.gc = gcdata.encode(data.gc)
                embed.addFields({
                    name: "Moduł *GlobalChat*",
                    value: [
                        `Moderator: ${isInMysteryTeam || data.gc.modPerms > 0 ? customEmoticons.approved : customEmoticons.denided}`,
                        `Karma: **${data.gc.karma.toString()}**`,
                        data.gc.isBlocked
                            ? `Zablokowany: ${customEmoticons.approved} (${
                                  data.gc.blockTimestamp === Infinity ? "do odwołania" : `pozostały czas w godzinach: ~${info.blockTimestamp - Math.floor(Date.now() / 3_600_000)}`
                              })\nPowód blokady:\`\`\`${data.gc.blockReason || "Nie sprecyzowano powodu."}\`\`\``
                            : `Zablokowany: ${customEmoticons.denided}`,
                    ].join("\n"),
                })
            }
        }

        return interaction.editReply({ embeds: [embed] })
    },
}
