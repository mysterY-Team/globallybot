const { Client, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { wait } = require("../../../functions/useful")

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const osoba = interaction.options.get("osoba", true).user
        const membercheck = Boolean(interaction.options.get("osoba", true).member)
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
            "jan.kowalski@klimpex.pl",
            "anna.nowak@tormex.eu",
            "bartek123@zonix.pl",
            "kasia.wrobel@xalnet.com",
            "piotr_zielinski@kolmaro.eu",
            "ewelina.kaminska@kromex.net",
            "pawel.lewandowski@zinfex.pl",
            "agata.makowska@politrio.com",
            "tomek.krawczyk@zetronix.eu",
            "marta_kos@flexnet.pl",
            "krzysiek.nowicki@verinex.com",
            "magda.jaworska@qstom.pl",
            "wojciech.sobczak@xomero.eu",
            "zuzia.mazur@zinknet.com",
            "piotr_sadowski@kamaro.pl",
            "basia.pietrzak@romplex.eu",
            "lukasz_jankowski@flamex.net",
            "aneta.wojcik@merinox.com",
            "marcin.nowakowski@tronics.pl",
            "klaudia_kubicka@zarnet.eu",
            "kamil.ostrowski@komexis.pl",
            "malgorzata.szulc@zaltor.net",
            "daniel.dudek@rimlex.com",
            "ewa.wilczek@fortrix.eu",
            "adam_kowalczyk@dominet.pl",
            "agnieszka.michalak@zoltrix.com",
            "mateusz.szymanski@kartelix.eu",
            "monika.kwiatkowska@vertol.pl",
            "rafal_jasinski@polinex.com",
            "natalia.wisniewska@klonex.eu",
            "michal_wozniak@torlex.net",
            "beata.matuszewska@karplex.pl",
            "przemek.zawadzki@optimax.com",
            "iza.kalinowska@zotronix.eu",
            "jerzy.kaczmarek@karmet.pl",
            "mariusz_wojciechowski@romatex.net",
            "emilia.makowska@ziplex.eu",
            "tomek.marciniak@tronomex.com",
            "sylwia.wilczak@monexis.pl",
            "piotr.stolarz@zimtronix.eu",
            "dorota.sikora@zonis.com",
            "janusz_krol@flamex.pl",
            "aleksandra_pawlak@kormet.eu",
            "bartosz.konieczny@zolmaro.com",
            "karolina_zaremba@trominex.pl",
            "przemek_gorski@romexis.net",
            "piotr.majewski@klinet.pl",
            "ewelina.borowska@xoset.eu",
            "krzysztof_wisniewski@klaronet.com",
            "marta_jastrzebska@zornex.pl",
            "wojciech_zajac@kromix.eu",
            "olga.sikorska@flemix.net",
            "danuta_urbanek@veriton.pl",
            "adam.mroczek@xotram.eu",
            "janina_lis@zimexis.com",
            "marcin_piechota@rolmet.eu",
            "dominik_wojtas@zaltronix.net",
            "wojtek_nowak@dominox.pl",
            "agnieszka_krol@zomexis.com",
            "pawel.wozniak@ronetix.eu",
            "magda_lis@flomex.pl",
            "kamil.sobczak@zimtronix.eu",
            "ania_dabrowska@zetalix.com",
            "tomasz_bialek@xolnet.pl",
            "katarzyna.krawczyk@komonex.eu",
            "piotr.zalewski@zortronix.net",
            "sylwia.wojcik@kronet.pl",
            "tomasz_czerwinski@flimexis.eu",
            "agata.nowakowska@zomatro.com",
            "karolina_kos@tramonet.pl",
            "michał.wojciechowski@kontronix.net",
            "jolanta_pawlowska@xorimex.eu",
            "mateusz.wisniewski@klomex.com",
            "kasia_borek@zolmetis.pl",
            "wojtek_stasiak@kartolix.eu",
            "dominika_olszewska@ziltronix.com",
            "krzysztof_duda@tramex.pl",
            "olga_kowalczyk@xolaris.eu",
            "piotr_smolinski@kronetix.net",
            "patrycja.makowska@zolmonix.com",
            "jan.mazur@verimex.pl",
            "paula_czech@zimelix.eu",
            "ewa.szymczak@tronexis.com",
            "bartek_wilczyk@xartis.pl",
            "agata.wojtas@klotronix.eu",
            "dominik_borowski@zonelix.com",
            "ewa.sikorska@karflex.pl",
            "marcin_gorski@zomex.eu",
            "piotr_urbanek@xaromex.com",
            "ola_kozlowska@flamex.eu",
            "aneta.kwiatkowska@tromonix.net",
            "przemek.wojciechowski@zimelix.com",
            "karolina_jasinska@zetrix.pl",
            "janusz.kowalski@xomex.eu",
            "aneta_dabrowska@ronexis.com",
            "wojtek_sawicki@krometix.pl",
            "dominika_kaczmarek@zeltronix.eu",
            "kamil_olszewski@zotrimex.net",
            "piotr.kasprzak@tronet.pl",
            "emilia.nowak@komtronix.com",
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
            await interaction.reply("Rozpoczynam hakowanie...")
            if (!membercheck) {
                await wait(500)
                await interaction.reply("Szukanie informacji po każdym zakątku Internetu...")
                await wait(5000)
            }
            await wait(2000)
            await interaction.editReply("Skanowanie urządzeń ofiary...")
            await wait(3000)

            if (Math.floor(Math.random() * 2) + 1 === 1) {
                await interaction.editReply("Urządzenia ofiary były dobrze zabezpieczone. Ofiara dostała powiadomienie o próbie zhakowania jego urządzeń przez Ciebie.")
                osoba.send({
                    content: `${interaction.user} (\`${interaction.user.username}\`) próbował Cię zhakować... Pokaż mu co potrafisz!`,
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId("deleteThisMessage").setLabel(`Usuń tą wiadomość dla mnie`)
                        ),
                    ],
                })
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
                let mailMessage = "Adresy Mailowe: **Brak**"

                if (randomCountMails > 0) {
                    let mail = []
                    for (let i = 0; i < randomCountMails; i++) {
                        const randomMail = mails[Math.floor(Math.random() * mails.length)]
                        mail.push(randomMail)
                    }
                    mailMessage = `Adresy Mailowe: ||**${mail.join(", ")}**||`
                }

                interaction.user.send(
                    `Udało Ci się zhakować użytkownika \`${osoba.username}\` (\`${osoba.id}\`). Tutaj są rozpisane wszystkie jego/jej dane:\nAdres IP: **||${ip}||**\nNr. Tel: **||${phone}||**\n${mailMessage}`
                )
            }
        }
    },
}
