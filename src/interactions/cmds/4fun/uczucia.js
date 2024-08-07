const { CommandInteraction, EmbedBuilder, Client, GuildMember } = require("discord.js")
const { request } = require("undici")
const { customEmoticons } = require("../../../config")
const { wait } = require("../../../functions/useful")

module.exports = {
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const action = interaction.options._subcommand

        const fondnesses = {
            pocałuj: {
                api_reaction: "kiss",
                uses_user: true,
                action_what_user_did: "pocałował(-a)",
                interaction_responses: [`${interaction.user} pocałował(-a) {user}! Jak słodko~`, `Czyżby ${interaction.user} chciał(-a) przekazać dla {user}, że ją/jego kocha?`],
            },
            przytul: {
                api_reaction: "hug",
                uses_user: true,
                action_what_user_did: "przytulił(-a)",
                interaction_responses: [`${interaction.user} pogłaskał(-a) {user}! Jak słodko~`, `Widać, że ${interaction.user} i {user} traktują się jak rodzeństwo~`],
            },
            pogłaszcz: {
                api_reaction: "pat",
                uses_user: true,
                action_what_user_did: "pogłaskał(-a)",
                interaction_responses: [
                    `${interaction.user} pogłaskał(-a) {user}! Jak słodko~`,
                    `${interaction.user} pogłaskał(-a) {user}! Widać, że traktuje ją/jego jak swojego zwierzaka, hehe~`,
                ],
            },
            uderz: {
                api_reaction: "slap",
                uses_user: true,
                action_what_user_did: "uderzył(-a)",
                interaction_responses: [
                    `${interaction.user} uderzył(-a) {user}! To musiało boleć!`,
                    `"Poszło jak masło. Przeciwnik oberwał!" - tak mówił(-a) ${interaction.user} po śmiertelnym uderzeniu {user}`,
                ],
            },
            ugryź: {
                api_reaction: "bite",
                uses_user: true,
                action_what_user_did: "ugryzł(-a)",
                interaction_responses: [
                    `Uwaga, ${interaction.user} zaczyna gryźć! Jego ofiarą padł już {user}, pora na kolejnego!`,
                    `Wampir ${interaction.user} właśnie ugryzł(-a) {user}, to chyba koniec jego życia`,
                    `${interaction.user} ugryzł(-a) {user}! Jak słodko~`,
                    `${interaction.user} ugryzł(-a) {user}! To musiało być bolesne!`,
                ],
            },
            poliż: {
                api_reaction: "lick",
                uses_user: true,
                action_what_user_did: "polizał(-a)",
                interaction_responses: [`${interaction.user} polizał(-a) {user}! Jak słodko~`, `${interaction.user} zamienił(-a) się w kota i zaczął(-ęła) gnębić {user}...`],
            },
            uciekaj: {
                api_reaction: "run",
                uses_user: false,
                interaction_responses: [
                    `${interaction.user} pobiegł(-a) niczym burza 🌩️`,
                    `${interaction.user} wieje tam, gdzie raki zimują...`,
                    `${interaction.user} ucieka przed siebie`,
                ],
            },
            foch: {
                api_reaction: "pout",
                uses_user: false,
                interaction_responses: [`Ojoj, ${interaction.user} jakiś zły...`, `${interaction.user} właśnie dostał focha`],
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
            var response = fondnesses[action].interaction_responses[Math.floor(Math.random() * fondnesses[action].interaction_responses.length)].replace("{user}", member)
            try {
                var msg = await member.send(
                    `Ej, ja tylko w ramach informacji, że ${interaction.user} w tym momencie Cię ${fondnesses[action].action_what_user_did} na kanale ${
                        interaction.channel
                    }. Ta wiadomość usunie się za <t:${Math.floor(Date.now() / 1000) + 15}:R>`
                )
                wait(14900).then(() => {
                    if (msg.deletable) msg.delete()
                })
            } catch (e) {}
        }

        const image = (await (await request(`https://api.otakugifs.xyz/gif?reaction=${fondnesses[action].api_reaction}`)).body.json()).url
        const embed = new EmbedBuilder().setColor("Random").setDescription(response).setImage(image)

        interaction.editReply({
            embeds: [embed],
        })
    },
}
