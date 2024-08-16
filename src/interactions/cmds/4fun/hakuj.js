const { Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const { wait } = require("../../../functions/useful");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        // Maile
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
        ];

        const osoba = interaction.options.get("osoba");
        // Sprawdzanie czy użytkownik nie jest aplikacją
        if (osoba.user.bot || osoba.user.system) {
            return interaction.reply("Nie można zhakować tej osoby...");
        }
        // Sprawdzanie czy użytkownik nie próbuje użyć komendy na sobie
        if (interaction.user.id === osoba.user.id) {
            interaction.reply("Nie możesz zhakować samego siebie...");
            return
        } else {
            await interaction.deferReply("Rozpoczynam hakowanie...");
            await wait(1000);
            await interaction.editReply("Wykradanie kont bankowych, haseł...");
            await wait(1000);
            await interaction.editReply("Skanowanie urządzeń ofiary...");
            await wait(1000);

            if (Math.floor(Math.random() * 2) + 1 === 1) {
                await interaction.editReply("Urządzenia ofiary były dobrze zabezpieczone. Ofiara dostała powiadomienie o próbie zhakowania jego urządzeń przez Ciebie.");
                osoba.user.send(`${interaction.user.username} (${interaction.user.id}) próbował Cię zhakować... Pokaż mu co potrafisz!`);
            } else {
                await interaction.editReply("Udało się przechwycić wszystkie dane wrażliwe ofiary! Otrzymałeś je na maila.");

                // Generowanie losowego IP
                const randomIPNum = () => Math.floor(Math.random() * 256);
                const ip = `${randomIPNum()}.${randomIPNum()}.${randomIPNum()}.${randomIPNum()}`;

                // Generowanie losowego numeru telefonu
                const randomPhoneNum = () => Math.floor(Math.random() * 10);
                const phone = `${randomPhoneNum()}${randomPhoneNum()}${randomPhoneNum()} ${randomPhoneNum()}${randomPhoneNum()}${randomPhoneNum()} ${randomPhoneNum()}${randomPhoneNum()}${randomPhoneNum()}`;

                // Liczba maili do wylosowania
                const randomCountMails = Math.floor(Math.random() * 3);
                const mailMessage = "Adresy Mailowe: **Brak**";
    
                if (randomCountMails > 0) {
                    const mail = [];
                    for (let i = 0; i < randomCountMails; i++) {
                        const randomMail = mails[Math.floor(Math.random() * mails.length)];
                        mail.push(randomMail);
                    }
                    mailMessage = `Adresy Mailowe: ||**${mail.join(", ")}**||`;
                }

                interaction.user.send(`Udało Ci się zhakowac użytkownika: ${osoba.user.username} (${osoba.user.id}). Tutaj są rozpisane wszystkie jego/jej dane:\nAdres IP: **||${ip}||**\nNr. Tel: **||${phone}||**\n${mailMessage}`);
            }
        }
    }
};
