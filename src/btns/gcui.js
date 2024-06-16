const { Client, ButtonInteraction, EmbedBuilder, UserPremiumType } = require("discord.js")
const { customEmoticons, ownersID, GCmodsID, db } = require("../config")
const { gcdata } = require("../functions/dbs")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        await interaction.deferReply({ ephemeral: true })
        var user = await client.users.fetch(args[0])

        const booltext = (x) => (x ? customEmoticons.approved : customEmoticons.denided)

        var data = gcdata.encode(db.get(`userData/${args[0]}/gc`).val)
        var haveImacarrrd = db.get(`userData/${args[0]}/imaca`).exists

        var embed = new EmbedBuilder()
            .setAuthor({ name: `${user.displayName} (${user.discriminator === "0" ? user.username : user.username + "#" + user.discriminator})` })
            .setTitle("Informacje o autorze owej wiadomości")
            .setThumbnail(user.displayAvatarURL({ extension: "webp", size: 1024 }))
            .setDescription(
                `ID: \`${args[0]}\`\nUtworzenie konta: **<t:${Math.floor(user.createdTimestamp / 1000)}:R>**\nWłaściciel bota: ${booltext(
                    ownersID.includes(args[0])
                )}\nModerator GlobalChat: ${booltext(ownersID.includes(args[0]) || GCmodsID.includes(args[0]))}${
                    haveImacarrrd ? `\n\n*Ten użytkownik posiada ImaCarrrd! Sprawdź pod komendą \`imacarrrd pokaż osoba:${args[0]}\`*` : ""
                }\nKarma: **${data.karma.toString()}**`
            )
            .setFooter({ text: 'Złamał regulamin? Skontaktuj się do serwera support - komenda "botinfo"' })
            .setColor("Random")
        interaction.editReply({ embeds: [embed] })
    },
}
