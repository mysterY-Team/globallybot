import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs
import conf from "../../config.js"
const { customEmoticons } = conf

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {

        const date = Date.now() - interaction.createdTimestamp;

        await interaction.reply({ content: "Wysłano", flags: 64 });

        await interaction.channel.send({ content: "..." }).then((m) => {
            const description = {
                ping: date,
                edit: m.createdTimestamp - interaction.createdTimestamp,
                apiPing: client.ws.ping,
            };

            const embedSuccess = new EmbedBuilder()
                .setTitle(`${customEmoticons.info} Ping Bota`)
                .setDescription("Ping (sending): " + description.ping + "\n" + "Ping (editing): " + description.edit + "\n" + "Ping (api): " + description.apiPing)
                .setFooter({ text: "Globally, powered by mysterY | Licensed on GNU GPL v3" })
                .setColor("Yellow")

            return m.edit({ content: null, embeds: [embedSuccess] });
        });
    },
}
