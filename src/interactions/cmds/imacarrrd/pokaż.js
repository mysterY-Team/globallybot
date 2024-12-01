import djs from "discord.js"
/** @type {{ GuildMember: import("discord.js").GuildMember }} */
const { GuildMember } = djs
import { createCarrrd } from "../../../functions/imaca.js"
import conf from "../../../config.js"
const { db } = conf
import { imacaData } from "../../../functions/dbSystem.js"

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        /**
         * @type {import("discord.js").User}
         */
        var user = interaction.options.get("osoba")?.user || interaction.user
        /**
         * @type {import("discord.js").GuildMember | import("discord.js").APIGuildMember | null | undefined}
         */
        var member = interaction.options.get("osoba")?.member || interaction.member

        const imacaOptionsData = {
            username: user.username,
            id: user.id,
            global: {
                avatar: user.displayAvatarURL({ forceStatic: true, extension: "png", size: 512 }),
                banner: user.bannerURL({ extension: "png", forceStatic: true, size: 1024 }),
                joinedAt: user.createdAt,
            },
            guild: member
                ? {
                      avatar: (() => {
                          if (member instanceof GuildMember) return member.displayAvatarURL({ extension: "png", forceStatic: true, size: 1024 })
                          if (member.avatar) return `https://cdn.discordapp.com/guilds/${interaction.guild.id}/users/${user.id}/avatars/${member.avatar}.webp?size=512`
                          else return user.displayAvatarURL({ forceStatic: true, extension: "png", size: 512 })
                      })(),
                      banner: user.bannerURL({ forceStatic: true, extension: "png", size: 512 }),
                      joinedAt: member.joinedAt ?? new Date(member.joined_at),
                      activities: (() => {
                          if (member instanceof GuildMember) return member.presence?.activities
                          else return null
                      })(),
                      status: (() => {
                          if (member instanceof GuildMember) return member.presence?.status ?? "offline"
                          else return "offline"
                      })(),
                  }
                : null,
        }

        await interaction.deferReply()
        var snpsht = await db.aget(`userData/${user.id}/imaca`)
        var data = imacaData.encode(snpsht.val)

        const attachment = await createCarrrd(data, imacaOptionsData)

        interaction.editReply({ files: [attachment] })
    },
}
