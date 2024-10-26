import djs from "discord.js"
const { CommandInteraction, EmbedBuilder, Client, RoleManager } = djs
import conf from "../../../config.js"
const { customEmoticons } = conf

export default {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute(client, interaction) {
        if (!(await interaction.guild.members.fetchMe()).permissions.has("Administrator")) {
            interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.info} Ta, jak i inne komendy z kategorii \`admin\` wymagają od bota posiadania permisji **Administrator**.`,
            })
        }
        var nazwa = interaction.options.get("nazwa", true).value
        var kolor = interaction.options.get("kolor")?.value
        var ikona = interaction.options.get("ikona")?.value

        const role = await interaction.guild.roles.create({
            name: nazwa,
            color: kolor,
            icon: ikona,
        })

        var poprawnie = new EmbedBuilder().setDescription(`${customEmoticons.approved} Rola ${role} została stworzona poprawnie!`).setColor("Green")

        interaction.reply({ embeds: [poprawnie] })
    },
}
