const { ChatInputCommandInteraction, EmbedBuilder, Client, GuildMember } = require("discord.js")
const { request } = require("undici")
const { customEmoticons } = require("../../../config")
const { wait } = require("../../../functions/useful")

module.exports = {
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const action = interaction.options.get("typ", true).value

        const fondnesses = {
            kiss: {
                uses_user: true,
                action_what_user_did: "pocałował(-a)",
                interaction_responses: [`${interaction.user} pocałował(-a) {user}! Jak słodko~`, `Czyżby ${interaction.user} chciał(-a) przekazać dla {user}, że ją/jego kocha?`],
            },
            hug: {
                uses_user: true,
                action_what_user_did: "przytulił(-a)",
                interaction_responses: [`${interaction.user} przytulił(-a) {user}! Jak słodko~`, `Widać, że ${interaction.user} i {user} traktują się jak rodzeństwo~`],
            },
            pat: {
                uses_user: true,
                action_what_user_did: "pogłaskał(-a)",
                interaction_responses: [
                    `${interaction.user} pogłaskał(-a) {user}! Jak słodko~`,
                    `${interaction.user} pogłaskał(-a) {user}! Widać, że traktuje ją/jego jak swojego zwierzaka, hehe~`,
                ],
            },
            slap: {
                uses_user: true,
                action_what_user_did: "uderzył(-a)",
                interaction_responses: [
                    `${interaction.user} uderzył(-a) {user}! To musiało boleć!`,
                    `"Poszło jak w masło. Przeciwnik oberwał!" - tak mówił(-a) ${interaction.user} po śmiertelnym uderzeniu {user}`,
                ],
            },
            bite: {
                uses_user: true,
                action_what_user_did: "ugryzł(-a)",
                interaction_responses: [
                    `Uwaga, ${interaction.user} zaczyna gryźć! Jego ofiarą padł już {user}, pora na kolejnego!`,
                    `Wampir ${interaction.user} właśnie ugryzł(-a) {user}, to chyba koniec jego życia`,
                    `${interaction.user} ugryzł(-a) {user}! Jak słodko~`,
                    `${interaction.user} ugryzł(-a) {user}! To musiało być bolesne!`,
                ],
            },
            lick: {
                uses_user: true,
                action_what_user_did: "polizał(-a)",
                interaction_responses: [`${interaction.user} polizał(-a) {user}! Jak słodko~`, `${interaction.user} zamienił(-a) się w kota i zaczął(-ęła) gnębić {user}...`],
            },
            run: {
                uses_user: false,
                interaction_responses: [
                    `${interaction.user} pobiegł(-a) niczym burza 🌩️`,
                    `${interaction.user} wieje tam, gdzie raki zimują...`,
                    `${interaction.user} ucieka przed siebie`,
                    `${interaction.user} biegnie przed siebie`,
                ],
            },
            pout: {
                uses_user: false,
                interaction_responses: [`Ojoj, ${interaction.user} jakiś zły...`, `${interaction.user} właśnie dostał(-a) focha`],
            },
            yay: {
                uses_user: false,
                interaction_responses: [`${interaction.user} cieszy się jak nigdy dotąd!`, `Widać radość ${interaction.user} na kilometry. Widać, że ma szczęśliwy dzień!`],
            },
            wave: {
                uses_user: true,
                action_what_user_did: "pomachał(-a)",
                interaction_responses: [
                    `[\`${interaction.user.username}\`]: *\\*macha do \`{user:username}\`\\**`,
                    `${interaction.user} przywitał(-a) {user}`,
                    `Kawaii przywitanie od ${interaction.user} dla {user} ^w^`,
                ],
            },
            sleep: {
                uses_user: false,
                interaction_responses: [
                    `*Real footage of eppy ${interaction.user}*`,
                    `*Real footage of ${interaction.user} sleeping*`,
                    `${interaction.user} w taktyczny sposób zasnął(-ęła)`,
                    `${interaction.user} zaszedł(-ła) w sen zimowy...`,
                ],
            },
            confused: {
                uses_user: false,
                interaction_responses: [`Mózg ${interaction.user} przestał mózgować.`, `${interaction.user} jest aktualnie w mieszanych uczuciach...`],
            },
            shout: {
                uses_user: true,
                action_what_user_did: "nakrzyczał(-a)",
                interaction_responses: [`${interaction.user} wpadł w furię, i chce się wyżyć na {user}`],
            },
        }

        if (!fondnesses[action].uses_user) {
            await interaction.deferReply()
            var response = fondnesses[action].interaction_responses[Math.floor(Math.random() * fondnesses[action].interaction_responses.length)]
        } else {
            const member = interaction.options.get("osoba", true).member
            if (!member || !(member instanceof GuildMember)) {
                interaction.reply({
                    content: `${customEmoticons.minus} Najlepiej byłoby gdyby ta osoba była na serwerze...`,
                    ephemeral: true,
                })
                return
            }

            if (member.id === interaction.user.id) {
                interaction.reply({
                    content: `${customEmoticons.minus} Trochę tak jakby... nie ma sensu robić czegoś dla siebie samego`,
                    ephemeral: true,
                })
                return
            }

            if (member.user.bot || member.user.system) {
                interaction.reply({
                    content: `${customEmoticons.info} Botów nie uwzględniam!`,
                    ephemeral: true,
                })
                return
            }

            await interaction.deferReply()
            var response = fondnesses[action].interaction_responses[Math.floor(Math.random() * fondnesses[action].interaction_responses.length)]
                .replace("{user}", member)
                .replace(/{user:([a-zA-Z]+)}/, (match, arg1) => member.user[arg1])
            try {
                var msg = await member.send({
                    content: `Ej, ja tylko w ramach informacji, że ${interaction.user} w tym momencie Cię ${fondnesses[action].action_what_user_did} na kanale ${interaction.channel}!`,
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId("deleteThisMessage").setLabel(`Usuń tą wiadomość dla mnie`)
                        ),
                    ],
                })
            } catch (e) {}
        }

        const image = (await (await request(`https://api.otakugifs.xyz/gif?reaction=${action}`)).body.json()).url
        const embed = new EmbedBuilder().setColor("Random").setDescription(response).setImage(image)

        interaction.editReply({
            embeds: [embed],
        })
    },
}
