const { ButtonInteraction, Client, EmbedBuilder, EmbedType } = require("discord.js")
const { customEmoticons, firebaseApp, _bot } = require("../config")
const { get, ref, getDatabase } = require("@firebase/database")

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        var uid = args[0]
        if (interaction.user.id === uid) {
            interaction.deferUpdate()
            return
        }
        await interaction.deferReply({ ephemeral: true })
        var userData = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${interaction.user.id}/gc`))
        if (!userData.exists()) {
            interaction.editReply(`${customEmoticons.denided} Wymagany jest profil, aby użyć tej funkcji! Utworzysz pod komendą \`profil utwórz typ:GlobalChat\``)
            return
        }
        if (userData.val().block.is) {
            interaction.editReply(`${customEmoticons.denided} Jesteś zablokowany w usłudze GlobalChat!`)
        }
        try {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.discriminator === "0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`,
                    iconURL: (() => {
                        var pp = interaction.user.defaultAvatarURL
                        if (interaction.user.avatar !== null) pp = interaction.user.avatarURL({ size: 32, extension: "webp" })
                        if (interaction.member.avatar !== null && interaction.member.avatar !== interaction.user.avatar)
                            pp = interaction.member.avatarURL({ size: 32, extension: "webp" })

                        return pp
                    })(),
                })
                .setDescription(`Użytkownik <@${interaction.user.id}> zaczepił/-a Cię na GlobalChacie! Sprawdź, co się tam dzieje!`)
                .setColor("Random")

            var user = await client.users.fetch(uid)
            await user.send({ embeds: [embed] })
            interaction.editReply(`${customEmoticons.approved} Wysłano pomyślnie zaczepkę!`)
        } catch (err) {
            interaction.editReply(`${customEmoticons.denided} Nie udało się wysłać zaczepki!`)
        }
    },
}
