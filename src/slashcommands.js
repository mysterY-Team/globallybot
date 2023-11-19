const { SlashCommandBuilder } = require("@discordjs/builders")
const { ChannelType } = require("discord.js")
const fs = require("fs")

var slashList = [
    new SlashCommandBuilder()
        .setName("globalchat")
        .setDescription("Komendy dotyczące GlobalChata")
        .setDMPermission(true)
        .addSubcommand((subcommand) => subcommand.setName("regulamin").setDescription("Wysyła regulamin dotyczący GlobalChata"))
        .addSubcommand((subcommand) => subcommand.setName("emotes").setDescription("Daje listę emotek dostępnych do użycia na GlobalChacie"))
        .addSubcommandGroup((subcommand_group) =>
            subcommand_group
                .setName("osoba")
                .setDescription("Komendy zarządzające osobą")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("odblokuj")
                        .setDescription("Usuwa osobę z czarnej listy GlobalChata.")
                        .addStringOption((option) => option.setName("osoba").setDescription("ID osoby do odblokowania.").setRequired(true))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("zablokuj")
                        .setDescription("Dodaje osoby do czarnej listy GlobalChata.")
                        .addStringOption((option) => option.setName("osoba").setDescription("ID osoby do zablokowania.").setRequired(true))
                        .addStringOption((option) => option.setName("powód").setDescription("Powód zablokowania."))
                )
        )
        .addSubcommandGroup((subcommand_group) =>
            subcommand_group
                .setName("kanał")
                .setDescription("Komendy konfigurujące kanał do Globalchata")
                .addSubcommand((subcommand) => subcommand.setName("usuń").setDescription("Usuwa GlobalChat na serwerze"))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("ustaw")
                        .setDescription("Konfiguruje GlobalChat na serwerze")
                        .addChannelOption((option) =>
                            option.setName("kanał").setDescription("Kanał, na którym ma się znajdować GlobalChat.").setRequired(true).addChannelTypes(ChannelType.GuildText)
                        )
                )
        )
        .addSubcommandGroup((subcommand_group) =>
            subcommand_group
                .setName("globalactions")
                .setDescription("Akcje dostępne w usłudze GlobalChat")
                .addSubcommand((subcommand) => subcommand.setName("about").setDescription("Informacje na temat GlobalActions"))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("info")
                        .setDescription("Informacje na temat danej akcji w GlobalActions")
                        .addStringOption((option) =>
                            option
                                .setName("ga")
                                .setDescription("Nazwa akcji")
                                .setRequired(true)
                                .addChoices(
                                    ...fs.readdirSync("./src/globalactions/").map((x) => {
                                        x = x.replace(".js", "")
                                        x = { name: require(`./globalactions/${x}`).data.name, value: x }

                                        return x
                                    })
                                )
                        )
                )
        ),
    new SlashCommandBuilder()
        .setName("gradientowo")
        .setDMPermission(true)
        .setDescription("Tworzy kod dający gradient w Minecraft; obsługuje typ JSON")
        .addStringOption((option) => option.setName("kolory").setDescription("Kolory w gradiencie, kod HEX oddzielone spacją, np. #084CFB #ADF3FD").setRequired(true))
        .addStringOption((option) => option.setName("tekst").setDescription("Tekst gradientowany").setRequired(true))
        .addStringOption((option) =>
            option.setName("typ").setDescription("Typ zwracania tekstu").setRequired(true).addChoices(
                { name: "JSON (czysty Minecraft)", value: "json" },
                {
                    name: "Birdflop RGB (pluginowa, ułatwiona wersja; &#RRGGBB)",
                    value: "br_rgb",
                },
                {
                    name: "Legacy (pluginowa, formalna wersja; &x&R&R&G&G&B&B)",
                    value: "legacy",
                },
                {
                    name: "Konsola (\u00A7x\u00A7R\u00A7R\u00A7G\u00A7G\u00A7B\u00A7B)",
                    value: "cnsl",
                },
                {
                    name: "MOTD (\\u00A7x\\u00A7R\\u00A7R\\u00A7G\\u00A7G\\u00A7B\\u00A7B)",
                    value: "motd",
                },
                { name: "Chat (<#RRGGBB>)", value: "chat" },
                {
                    name: "BBCode ([COLOR=#RRGGBB][/COLOR])",
                    value: "bbcode",
                }
            )
        )
        .addBooleanOption((option) => option.setName("pogrubiony").setDescription("Opcja pogrubienia"))
        .addBooleanOption((option) => option.setName("pochylony").setDescription("Opcja pochylenia. DOMYŚLNIE W JSON JEST POCHYLONA"))
        .addBooleanOption((option) => option.setName("podkreślony").setDescription("Opcja podkreślenia."))
        .addBooleanOption((option) => option.setName("przekreślony").setDescription("Opcja przekreślenia.")),
    new SlashCommandBuilder().setDMPermission(true).setName("dowcip").setDescription("Generuje dowcip ze strony PERELKI.NET"),
    new SlashCommandBuilder()
        .setDMPermission(true)
        .setName("mem")
        .setDescription("Generuje mema z podanego źródła")
        .addNumberOption((option) =>
            option.setName("źródło").setDescription("Źródło, w krórym mają być pobierane rekordy").setRequired(true).addChoices(
                {
                    name: "Losowe",
                    value: -1,
                },
                {
                    name: "Memy.pl",
                    value: 0,
                },
                {
                    name: "Kwejk.pl",
                    value: 1,
                },
                {
                    name: "JBZD",
                    value: 2,
                }
            )
        ),
    new SlashCommandBuilder().setDMPermission(true).setName("botinfo").setDescription("Generuje informacje o bocie, typu ilość serwerów, czy czas działania bota"),
    new SlashCommandBuilder()
        .setName("devtools")
        .setDMPermission(true)
        .setDescription("Mega tajemne komendy...")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("eval")
                .setDescription("Wykonuje kod [DLA DEWELOPERÓW]")
                .addStringOption((option) => option.setName("func").setDescription("Funkcja do wykonania").setRequired(true))
        ),
]
//console.log(slashList)

module.exports = {
    list: slashList,
}
