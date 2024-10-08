const { Client, ButtonInteraction, EmbedBuilder } = require("discord.js")
const { customEmoticons, db } = require("../../../config")
const { gcdata } = require("../../../functions/dbSystem")
const { checkUserStatus } = require("../../../functions/useful")

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

        const ssstatus = await checkUserStatus(client, args[0])
        const isInMysteryTeam = ssstatus.inSupport && ssstatus.mysteryTeam

        var data = gcdata.encode(db.get(`userData/${args[0]}/gc`).val)
        var haveImacarrrd = db.get(`userData/${args[0]}/imaca`).exists

        var embed = new EmbedBuilder()
            .setAuthor({ name: `${user.displayName} (${user.discriminator === "0" ? user.username : user.username + "#" + user.discriminator})` })
            .setTitle("Informacje o autorze owej wiadomości")
            .setThumbnail(user.displayAvatarURL({ extension: "webp", size: 1024 }))
            .setDescription(
                `ID: \`${args[0]}\`\nUtworzenie konta: **<t:${Math.floor(user.createdTimestamp / 1000)}:R>**\nWłaściciel bota: ${booltext(
                    isInMysteryTeam
                )}\nModerator GlobalChat: ${booltext(isInMysteryTeam || data.modPerms > 0)}\nKarma: **${data.karma.toString()}**${
                    haveImacarrrd
                        ? `\n\n*Ten użytkownik posiada ImaCarrrd! Możesz sprawdzić z poziomu:*\n- *komendy bota (\`imacarrrd pokaż osoba:${args[0]}\`)*\n- *GlobalAction (\`imaca!karta ${args[0]}\`)*!`
                        : ""
                }`
            )
            .setFooter({ text: 'Złamał regulamin? Skontaktuj się do serwera support - komenda "botinfo"' })
            .setColor("Random")
        interaction.editReply({ embeds: [embed] })
    },
}
