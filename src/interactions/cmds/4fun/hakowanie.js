const {Client, CommandInteraction, EmbedBuilder} = require("discord.js")
const { wait } = require("../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */


async execute(client, interaction) {
    const osoba = interaction.option.get("osoba")
    if(osoba.bot || osoba.system) {
        interaction.reply("Nie można zhakować tej osoby...")
    } else {
        await interaction.deferReply("Rozpoczynam hakowanie...")
        await wait(1_000)
        await interaction.editReply("Wykradanie kont bankowych, haseł...")
        await wait(1_000)
        await interaction.editReply("Skanowanie urządzeń ofiary...")
        await wait(2_000)
        if(Math.floor(Math.random()*2)+1 === 1) {
            await interaction.editReply("Urządzenia ofiary były dobrze zabezpieczone. Ofiara dostała powiadomienie o próbie zhakowania jego urządzeń przez Ciebie.")
            osoba.send(`${interaction.user.tag} Próbował Cię zhakować... Pokaż mu co potrafisz!`)
        } else {
            await interaction.editReply("Udało się przechwycić wszystkie dane wrażliwe ofiary! Otrzymałeś je na maila.")
            interaction.user.send(`Udało Ci się zhakowac ${osoba}. Tutaj są rozpisane wszystkie dane: \nAdres IP:`)
        }
    }
}
}