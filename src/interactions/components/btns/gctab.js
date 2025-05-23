import djs from "discord.js"
const { ButtonInteraction, Client, EmbedBuilder, DiscordAPIError } = djs
import conf from "../../../config.js"
const { customEmoticons, db } = conf
import { gcdata, gcdataGuild } from "../../../functions/dbSystem.js"

const times = {
    cooldown: 300,
    blockrepl: 60,
}

export default {
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ButtonInteraction} interaction
     * @param {string[]} args
     */
    async execute(client, interaction, ...args) {
        var uid = args[0]

        if (interaction.user.id === uid) {
            interaction.deferUpdate()
            return
        }
        var repliedMessgetimestamp = interaction.message.createdTimestamp

        await interaction.deferReply({ flags: ["Ephemeral"] })

        var userData1 = await db.get(`userData/${interaction.user.id}/gc`)
        var data1 = gcdata.encode(userData1.val)
        if (data1.isBlocked) {
            interaction.editReply(`${customEmoticons.denided} Jesteś zablokowany w usłudze GlobalChat!`)
            return
        }
        if (data1.karma < 1000n) {
            interaction.editReply(`${customEmoticons.denided} Aby użyć zaczepki, potrzeba **minimum** 1000 karmy`)
            return
        }
        if (data1.timestampToTab > Math.floor(Date.now() / 1000)) {
            interaction.editReply(`${customEmoticons.denided} Jeszcze musisz poczekać; już wysłałeś zaczepkę!`)
            return
        }

        var userData2 = await db.get(`userData/${uid}/gc`)
        var data2 = gcdata.encode(userData2.val ?? "")
        if (data2.isBlocked) {
            interaction.editReply(`${customEmoticons.denided} Użytkownik jest zablokowany! Daj mu spokój!`)
            return
        }
        if (data2.blockTimestampToTab > Math.floor(Date.now() / 1000)) {
            interaction.editReply(`${customEmoticons.loading} Ktoś już mu wysłał zaczepkę, poczekaj chwilkę...`)
            return
        }

        // console.log(data2.blockTimestampToTab, data1.timestampToTab, Math.floor(Date.now() / 1000))

        var station = Object.values((await db.get("serverData")).val)
            .filter((x) => "gc" in x)
            .map((x) => Object.entries(gcdataGuild.encode(x.gc)))
            .flat()
            .find((x) => x[1].channel === interaction.channel.id)

        if (!station) {
            interaction.editReply(`${customEmoticons.minus} Ten kanał już nie jest podpięty GlobalChatem!`)
            return
        }

        if (station[1].createdTimestamp > repliedMessgetimestamp) {
            interaction.editReply("Ta wiadomość powstała ze wcześniejszego podpięcia kamału do GlobalChatu, nie możesz już więc tego użytkownika zaczepić!")
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
                .setDescription(`Użytkownik <@${interaction.user.id}> zaczepił/-a Cię na GlobalChacie, pod stacją \`${station[0]}\`! Sprawdź, co się tam dzieje!`)
                .setFooter({ text: "Globally, powered by mysterY" })
                .setColor("Random")

            var user = await client.users.fetch(uid)
            await user.send({ embeds: [embed] })
            interaction.editReply(
                `${customEmoticons.approved} Wysłano pomyślnie zaczepkę! Zaczekaj do <t:${Math.floor(Date.now() / 1000) + times.cooldown + 3}:t> na następną zaczepkę!`
            )

            data1.timestampToTab = Math.floor(Date.now() / 1000) + times.cooldown
            data2.blockTimestampToTab = Math.floor(Date.now() / 1000) + times.blockrepl

            await db.get(`userData/${interaction.user.id}/gc`, gcdata.decode(data1))
            await db.get(`userData/${uid}/gc`, gcdata.decode(data2))
        } catch (err) {
            if (err instanceof DiscordAPIError && err.code === 50007) interaction.editReply(`${customEmoticons.denided} Nie udało się wysłać zaczepki!`)
            else throw err
        }
    },
}
