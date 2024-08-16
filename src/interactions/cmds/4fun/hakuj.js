const { Client, CommandInteraction, EmbedBuilder } = require("discord.js")
const { wait } = require("../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */


    async execute(client, interaction) {
        const mails = [
            "swirek3232@sigma.com",
            "mamHotMame@hotmejl.com",
            "patyczakusToPrzystojniak@and.pl",
            "globallyJestNajlepszy@sores.com",
            "appleEnjoyer2137@era.com",
            "szalonyJanekPierwszy@globally.pl",
            "piotrekP@gyat.eu",
            "kacpercz2005@scan.eu.com",
            "pizzermanRoblox@gry.com.pl",
            "kochamFortnite@globally.pl",
            "sigmaPrzemus@skibidi.eu.pl",
            "kochanyKacperek123@sigma.com",
            "PolskiPingwin@pdf.pl"
        ]
        const osoba = interaction.options.get("osoba")
        if (osoba.bot || osoba.system) {
            interaction.reply("Nie można zhakować tej osoby...")
        } else {
            await interaction.deferReply("Rozpoczynam hakowanie...")
            await wait(1_000)
            await interaction.editReply("Wykradanie kont bankowych, haseł...")
            await wait(1_000)
            await interaction.editReply("Skanowanie urządzeń ofiary...")
            await wait(2_000)
            if (Math.floor(Math.num() * 2) + 1 === 1) {
                await interaction.editReply("Urządzenia ofiary były dobrze zabezpieczone. Ofiara dostała powiadomienie o próbie zhakowania jego urządzeń przez Ciebie.")
                osoba.send(`${interaction.user.tag} Próbował Cię zhakować... Pokaż mu co potrafisz!`)
            } else {
                const num = [];
                for (i = 0; i < 16; i++) {
                    num.push(randomNumbers)
                    randomNums = Math.floor(Math.random() * 10) + 1
                }
                const randomCountMails = Math.floor(Math.random() * 3);
                if(randomCountMails === 0) {
                    await interaction.editReply("Udało się przechwycić wszystkie dane wrażliwe ofiary! Otrzymałeś je na maila.")
                    interaction.user.send(`Udało Ci się zhakowac ${osoba}. Tutaj są rozpisane wszystkie dane: \nAdres IP: **${num}${num}.${num}${num}${num}.${num}${num}${num}**\nNr. Tel:**${num}${num}${num} ${num}${num}${num} ${num}${num}${num}**\nAdresy Mailowe: **Brak**\n`)
                } else {
                    const mail = [];
                    for(i=0; i<randomCountMails; i++) {
                        mail.push(randomMail);
                        const randomMail = mails[Math.floor(Math.random() * mails.length)];
                    }
                    interaction.user.send(`Udało Ci się zhakowac ${osoba}. Tutaj są rozpisane wszystkie dane: \nAdres IP: **${num}${num}.${num}${num}${num}.${num}${num}${num}**\nNr. Tel:**${num}${num}${num} ${num}${num}${num} ${num}${num}${num}**\nAdresy Mailowe: **${randomMail}**`)
                }
            }
        }
    }
}
