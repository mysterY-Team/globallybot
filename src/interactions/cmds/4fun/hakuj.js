const { Client, CommandInteraction, EmbedBuilder } = require("discord.js")
const { wait } = require("../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const osoba = interaction.options.get("osoba").user
        // Suma cyfr w ID
        const idsum = (() => {
            var _x = osoba.id.split("")
            var ret = 0
            _x.forEach((x) => (ret += Number(x)))
            return ret
        })()

        // Maile
        const mails = [
            //kreator maili
            `${osoba.username}${idsum}@gmail.com`,
            `${osoba.username.slice(0, 3)}${osoba.id.slice(0, 2)}${osoba.createdAt.getUTCFullYear() + idsum}${osoba.id.at(-1)}@o2.pl`,

            //losowe maile
            "swirek3232@sigma.com",
            "mamhotmame@hotmejl.com",
            "patyczakustoprzystojniak@and.pl",
            "globallyjestnajlepszy@sores.com",
            "appleenjoyer2137@era.com",
            "szalonyjanekpierwszy@globally.pl",
            "piotrekp@gyat.eu",
            "kacpercz2005@scan.eu.com",
            "pizzerman.roblox@gry.com.pl",
            "kochamgortnite@globally.pl",
            "sigmaprzemus@skibidi.eu.pl",
            "kochanykacperek123@sigma.com",
            "polski.pingwin@pdf.pl",
            "melonmusk@gmail.com",
            "bread.sheeran@gmail.com",
            "czeresnieiwisnietwojstarykisnie@o2.pl",
            "slodkiekotki69@outlook.com",
        ]

        // Sprawdzanie czy użytkownik nie jest aplikacją
        if (osoba.bot || osoba.system) {
            return interaction.reply("Ta osoba posiada silne zabezpieczenia przez wojskowych, nie uda Ci się ich zhakować...")
        }
        // Sprawdzanie czy użytkownik nie próbuje użyć komendy na sobie
        if (interaction.user.id === osoba.id) {
            interaction.reply("Nie możesz zhakować samego siebie...")
            return
        } else {
            await interaction.deferReply("Rozpoczynam hakowanie...")
            await wait(2000)
            await interaction.editReply("Skanowanie urządzeń ofiary...")
            await wait(3000)

            if (Math.floor(Math.random() * 2) + 1 === 1) {
                await interaction.editReply("Urządzenia ofiary były dobrze zabezpieczone. Ofiara dostała powiadomienie o próbie zhakowania jego urządzeń przez Ciebie.")
                osoba.send(`${interaction.user} (\`${interaction.user.username}\`) próbował Cię zhakować... Pokaż mu co potrafisz!`)
            } else {
                await interaction.editReply("Wykradanie kont bankowych, haseł...")
                await wait(2000)
                await interaction.editReply("Udało się przechwycić wszystkie dane wrażliwe ofiary! Otrzymałeś je na maila.")

                // Generowanie losowego IP
                const randomIPNum = () => Math.floor(Math.random() * 256)
                const ip = `${randomIPNum()}.${randomIPNum()}.${randomIPNum()}.${randomIPNum()}`

                // Generowanie losowego numeru telefonu
                const randomPhoneNum = () => Math.floor(Math.random() * 10)
                const phone = `${randomPhoneNum()}${randomPhoneNum()}${randomPhoneNum()} ${randomPhoneNum()}${randomPhoneNum()}${randomPhoneNum()} ${randomPhoneNum()}${randomPhoneNum()}${randomPhoneNum()}`

                // Liczba maili do wylosowania
                const randomCountMails = Math.sqrt(Math.round(Math.random() * 9))
                const mailMessage = "Adresy Mailowe: **Brak**"

                if (randomCountMails > 0) {
                    const mail = []
                    for (let i = 0; i < randomCountMails; i++) {
                        const randomMail = mails[Math.floor(Math.random() * mails.length)]
                        mail.push(randomMail)
                    }
                    mailMessage = `Adresy Mailowe: ||**${mail.join(", ")}**||`
                }

                interaction.user.send(
                    `Udało Ci się zhakować użytkownika: ${osoba.user.username} (${osoba.user.id}). Tutaj są rozpisane wszystkie jego/jej dane:\nAdres IP: **||${ip}||**\nNr. Tel: **||${phone}||**\n${mailMessage}`
                )
            }
        }
    },
}
