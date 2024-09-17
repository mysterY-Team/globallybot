const { Client, EmbedBuilder, ChatInputCommandInteraction, InteractionContextType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { db, customEmoticons } = require("../../config")
const { gcdata } = require("../../functions/dbSystem")
const { checkUserStatus, getModules, botPremiumInfo, servers } = require("../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const user = interaction.options.get("osoba")?.user || interaction.user

        await interaction.deferReply()
        const ssstatus = await checkUserStatus(client, user.id)
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        const fdb = db.get(`userData/${user.id}`)
        var data = fdb.val ?? {}
        const premium = botPremiumInfo(user.id, ssstatus, data.premium)
        const modules = getModules(data)

        const guildlist = servers.get().map((x) => x.id)

        const premiumTypeofToText = (() => {
            if (!premium.have) return ""
            if (premium.typeof === "supportBoost") return "boost serwera support"
            if (premium.typeof === "trial") return `trial, pozostało dni: **${data.premium}**`
        })()

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
                    `Premium: ${isInMysteryTeam ? "`[ nie dotyczy ]`" : premium.have ? `${customEmoticons.approved} (${premiumTypeofToText})` : customEmoticons.denided}`,
                ].join("\n"),
            })

        if (interaction.context !== InteractionContextType.PrivateChannel && guildlist.includes(interaction.guildId) && !user.bot && !user.system) {
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
                                  data.gc.blockTimestamp === Infinity
                                      ? "do odwołania"
                                      : `pozostały czas w godzinach: **~${data.gc.blockTimestamp - Math.floor(Date.now() / 3_600_000)}**`
                              })\nPowód blokady:\`\`\`${data.gc.blockReason || "Nie sprecyzowano powodu."}\`\`\``
                            : `Zablokowany: ${customEmoticons.denided}`,
                    ].join("\n"),
                })
            }
        } else if (interaction.context === InteractionContextType.PrivateChannel || !guildlist.includes(interaction.guildId)) {
            var rows = [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(user.displayAvatarURL({ size: 4096 }))
                        .setLabel("Avatar użytkownika")
                ),
            ]
            if (user.banner)
                rows[0].addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(user.bannerURL({ size: 4096 }))
                        .setLabel("Banner użytkownika")
                )
        }
        return interaction.editReply({ embeds: [embed], components: rows ?? [] })
    },
}
