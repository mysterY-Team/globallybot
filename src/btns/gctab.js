const { ButtonInteraction, Client, EmbedBuilder, EmbedType } = require("discord.js")
const { customEmoticons, firebaseApp, _bot } = require("../config")
const { get, ref, getDatabase, set } = require("@firebase/database")
const { gcdata } = require("../functions/dbs")

var users = {
    inCooldown: [],
    blockedToReply: [],
}

const times = {
    cooldown: 300,
    blockrepl: 60,
}

module.exports = {
    /**
     * @param {Client} client
     * @param {ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        if (users.inCooldown.length >= 30 || users.blockedToReply.length >= 40) {
            interaction.reply({
                content: `${customEmoticons.loading} Zaczepianie zostało automatycznie wyłączone z powodu przeciążenia, sprawdź później`,
                ephemeral: true,
            })
        }
        if (users.inCooldown.includes(interaction.user.id)) {
            interaction.reply({
                content: `${customEmoticons.minus} Jesteś jeszcze na cooldownie!`,
                ephemeral: true,
            })
            return
        }
        var uid = args[0]
        if (interaction.user.id === uid || users.blockedToReply.includes(uid)) {
            interaction.deferUpdate()
            return
        }
        await interaction.deferReply({ ephemeral: true })
        var userData = await get(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${interaction.user.id}/gc`))
        if (!userData.exists()) {
            interaction.editReply(`${customEmoticons.denided} Wymagany jest profil, aby użyć tej funkcji! Utworzysz pod komendą \`profil utwórz typ:GlobalChat\``)
            return
        }
        if (gcdata.encode(userData.val()).isBlocked) {
            interaction.editReply(`${customEmoticons.denided} Jesteś zablokowany w usłudze GlobalChat!`)
            if (typeof userData.val() === "object")
                await set(ref(getDatabase(firebaseApp), `${_bot.type}/userData/${interaction.user.id}/gc`), gcdata.decode(gcdata.encode(userData)))
            return
        }
        try {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.discriminator === "0" ? interaction.user.username : `${interaction.user.username}#${interaction.user.discriminator}`,
                    iconURL: (() => {
                        var pp = interaction.user.defaultAvatarURL
                        if (interaction.user.avatar !== null) pp = interaction.user.displayAvatarURL({ size: 32, extension: "webp" })
                        if (interaction.member.avatar !== null && interaction.member.avatar !== interaction.user.avatar)
                            pp = interaction.member.displayAvatarURL({ size: 32, extension: "webp" })

                        return pp
                    })(),
                })
                .setDescription(`Użytkownik <@${interaction.user.id}> zaczepił/-a Cię na GlobalChacie! Sprawdź, co się tam dzieje!`)
                .setColor("Random")

            var user = await client.users.fetch(uid)
            await user.send({ embeds: [embed] })
            interaction.editReply(
                `${customEmoticons.approved} Wysłano pomyślnie zaczepkę! Zaczekaj do <t:${Math.floor(Date.now() / 1000) + times.cooldown + 3}:t> na następną zaczepkę!`
            )

            users.inCooldown.push(interaction.user.id)
            setTimeout(
                (id) => {
                    users.inCooldown = users.inCooldown.filter((x) => x !== id)
                },
                times.cooldown * 1000,
                interaction.user.id
            )
            users.blockedToReply.push(uid)
            setTimeout(
                (id) => {
                    users.blockedToReply = users.blockedToReply.filter((x) => x !== id)
                },
                times.blockrepl * 1000,
                uid
            )
        } catch (err) {
            interaction.editReply(`${customEmoticons.denided} Nie udało się wysłać zaczepki!`)
        }
    },
}
