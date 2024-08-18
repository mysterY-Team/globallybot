const { SlashCommandBuilder, ContextMenuCommandBuilder } = require("@discordjs/builders")
const { ChannelType, ApplicationCommandType, PermissionsBitField } = require("discord.js")
const fs = require("fs")

var slashList = [
    //globalchat
    new SlashCommandBuilder()
        .setName("globalchat")
        .setDescription("Komendy dotyczące GlobalChata")
        .setDMPermission(true)
        .addSubcommand((subcommand) => subcommand.setName("regulamin").setDescription("Wysyła regulamin dotyczący GlobalChata"))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("emotki")
                .setDescription("Daje listę emotek dostępnych do użycia na GlobalChacie")
                .addStringOption((option) => option.setName("query").setDescription("Wyszukiwanie nazwy emotek").setAutocomplete(true).setMinLength(3))
        )
        .addSubcommandGroup((subcommand_group) =>
            subcommand_group
                .setName("osoba")
                .setDescription("Komendy zarządzające osobą")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("odblokuj")
                        .setDescription("Nadaje z powrotem dostęp dla osoby do GlobalChatu")
                        .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby do sprawdzenia").setRequired(true))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("zablokuj")
                        .setDescription("Blokuje dla osoby dostęp do GlobalChatu")
                        .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby do zablokowania").setRequired(true))
                        .addStringOption((option) => option.setName("powód").setDescription("Powód blokady"))
                        .addNumberOption((option) => option.setName("czas").setDescription("Czas blokady (w godzinach)").setMinValue(1))
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("zmieńpermisję")
                        .setDescription("Pozwala na zmianę permisji dla danej osoby w GlobalChacie")
                        .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby do zmiany permisji").setRequired(true))
                        .addNumberOption((option) =>
                            option
                                .setName("permisja")
                                .setDescription("Nazwa permisji")
                                .setRequired(true)
                                .setChoices({ name: "Naczelnik GlobalChata", value: 2 }, { name: "Moderator GlobalChata", value: 1 }, { name: "Zwykła osoba", value: 0 })
                        )
                )
        )
        .addSubcommandGroup((subcommand_group) =>
            subcommand_group
                .setName("kanał")
                .setDescription("Komendy konfigurujące kanał do Globalchata")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("usuń")
                        .setDescription("Usuwa GlobalChat na serwerze")
                        .addChannelOption((option) =>
                            option.setName("kanał").setDescription("Kanał, na którym się znajduje GlobalChat").setRequired(true).addChannelTypes(ChannelType.GuildText)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("ustaw")
                        .setDescription("Konfiguruje GlobalChat na serwerze")
                        .addChannelOption((option) =>
                            option.setName("kanał").setDescription("Kanał, na którym ma się znajdować GlobalChat").setRequired(true).addChannelTypes(ChannelType.GuildText)
                        )
                        .addStringOption((option) =>
                            option
                                .setName("stacja")
                                .setDescription("Nazwa tzw. stacji - odpowiada ona za inne dobieranie serwerów")
                                .setRequired(true)
                                .setMinLength(4)
                                .setMaxLength(8)
                        )
                        .addStringOption((option) =>
                            option.setName("passwd").setDescription("Hasło do stacji, jeżeli takową posiada").setMinLength(8).setMaxLength(30).setRequired(false)
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("globalactions")
                .setDescription("Pokazuje wszystko, co potrzeba wiedzieć o GlobalActions")

                .addStringOption((option) =>
                    option
                        .setName("globalaction")
                        .setDescription("Nazwa akcji, w której to mają być pokazane informacje o niej")
                        .setRequired(false)
                        .addChoices(
                            ...fs.readdirSync("./src/globalactions/").map((x) => {
                                x = x.replace(".js", "")
                                x = { name: require(`./globalactions/${x}`).data.name, value: x }

                                return x
                            })
                        )
                )
        )
        .addSubcommandGroup((subcommand_group) =>
            subcommand_group
                .setName("stacja")
                .setDescription("Stacje pozwalające na dobieranie innych serwerów")
                .addSubcommand((subcommand) => subcommand.setName("załóż").setDescription("Tworzy stację do GlobalChata"))
                .addSubcommand((subcommand) => subcommand.setName("lista").setDescription("Informacje o dostępnych stacjach w GlobalChacie"))
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("moderator")
                        .setDescription("Usuwa/dodaje osobę jako moderatora stacji")
                        .addStringOption((option) =>
                            option
                                .setName("stacja")
                                .setDescription("Nazwa tzw. stacji - odpowiada ona za inne dobieranie serwerów")
                                .setRequired(true)
                                .setMinLength(4)
                                .setMaxLength(8)
                        )
                        .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby").setRequired(true))
                )
        )
        .addSubcommand((subcommand) => subcommand.setName("ranking").setDescription("Pokazuje ranking GlobalChat na podstawie karmy")),

    //gradient
    new SlashCommandBuilder()
        .setName("gradient")
        .setDescription("Tworzy kod dający gradient w Minecraft; obsługuje typ JSON")
        .setDMPermission(true)
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
        .addBooleanOption((option) => option.setName("pochylony").setDescription("Opcja pochylenia //DOMYŚLNIE W JSON JEST POCHYLONA"))
        .addBooleanOption((option) => option.setName("podkreślony").setDescription("Opcja podkreślenia"))
        .addBooleanOption((option) => option.setName("przekreślony").setDescription("Opcja przekreślenia")),

    //4fun
    new SlashCommandBuilder()
        .setName("4fun")
        .setDescription("Komendy 4fun")
        .setDMPermission(false)
        //jakieś błache
        .addSubcommand((subcommand) =>
            subcommand
                .setName("avatar")
                .setDescription("Pokazuje avatar użytkownika")
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby").setRequired(false))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("banner")
                .setDescription("Pokazuje banner użytkownika")
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby").setRequired(false))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("hakuj")
                .setDescription("Hakuje wybranego użytkownika")
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby którą chcesz zhakować").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("czynność")
                .setDescription("[Uczucia] Wykonaj jakąś akcję na osobie")
                .addStringOption((option) =>
                    option
                        .setName("typ")
                        .setDescription("Typ danej akcji")
                        .setRequired(true)
                        .setChoices(
                            { name: "🤗 Przytul", value: "hug" },
                            { name: "😙 Pocałuj", value: "kiss" },
                            { name: "😻 Pogłaszcz", value: "pat" },
                            { name: "🤕 Uderz", value: "slap" },
                            { name: "🧛 Ugryź", value: "bite" },
                            { name: "👅 Poliż", value: "lick" },
                            { name: "👋 Powitaj", value: "wave" },
                            { name: "🤬 Nakrzycz ", value: "shout" }
                        )
                )
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby ze serwera").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("reakcja")
                .setDescription("[Uczucia] Wyraź siebie za pomocą akcji")
                .addStringOption((option) =>
                    option
                        .setName("typ")
                        .setDescription("Typ danej akcji")
                        .setRequired(true)
                        .setChoices(
                            { name: "🏃 Ucieczka/bieg", value: "run" },
                            { name: "😤 Foch", value: "pout" },
                            { name: "😁 Radość", value: "yay" },
                            { name: "😴 Sen", value: "sleep" },
                            { name: "😵‍💫 Dezorient", value: "confused" }
                        )
                )
        ),

    //mniejsze z argumentami
    new SlashCommandBuilder()
        .setName("devtools")
        .setDescription("Mega tajemne komendy...")
        .setDMPermission(true)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("eval")
                .setDescription("Wykonuje kod [DLA TWÓRCÓW]")
                .addStringOption((option) => option.setName("func").setDescription("Funkcja do wykonania").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("premium")
                .setDescription("Zarządza premium [DLA TWÓRCÓW]")
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby ze serwera").setRequired(true))
                .addNumberOption((option) => option.setName("dni").setDescription("Jeżeli użyte, ustawia ilość dni premium").setMinValue(0).setRequired(false))
        ),
    new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Sprawdza użytkownika pod kątem Discorda oraz Globally")
        .setDMPermission(true)
        .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby")),
    new SlashCommandBuilder()
        .setName("imacarrrd")
        .setDescription("Karty użytkownika na nowym poziomie")
        .setDMPermission(true)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("pokaż")
                .setDescription("Pokazuje kartę ImaCarrrd użytkownika")
                .addUserOption((option) => option.setName("osoba").setDescription("Osoba z aktywnym modułem ImaCarrrd"))
        )
        .addSubcommand((subcommand) => subcommand.setName("konfiguruj").setDescription("Pozwala na edycję informacji karty ImaCarrrd użytkownika"))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("zmieństyl")
                .setDescription("Zmienia styl karty ImaCarrrd użytkownika")
                .addStringOption((option) => option.setName("styl").setDescription("Nazwa stylu").setAutocomplete(true).setRequired(true))
        ),
    new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Komendy administracyjne")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("clear")
                .setDescription("Czyści daną ilość wiadomości")
                .addIntegerOption((option) => option.setName("ilość").setDescription("ilość wiadomości do usunięcia.").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("ban")
                .setDescription("Banuje osobę")
                .addStringOption((option) => option.setName("osoba").setDescription("@wzmianka lub id osoby którą chcesz zbanować.").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("kick")
                .setDescription("Wyrzuca osobę")
                .addStringOption((option) => option.setName("osoba").setDescription("@wzmianka lub id osoby którą chcesz wyrzucić.").setRequired(true))
        ),
    //pojedyncze komendy
    new SlashCommandBuilder().setDMPermission(true).setName("dowcip").setDescription("Generuje dowcip ze strony PERELKI.NET"),
    new SlashCommandBuilder().setDMPermission(true).setName("botinfo").setDescription("Generuje informacje o bocie"),
    new SlashCommandBuilder().setDMPermission(true).setName("mem").setDescription("Generuje mema ze serwera MEMHUB"),
]

var contextList = [new ContextMenuCommandBuilder().setDMPermission(false).setType(ApplicationCommandType.Message).setName("Pokaż przyciski GlobalChat")]
//console.log(slashList)

module.exports = {
    list: () => {
        return Array().concat(slashList, contextList)
    },
}
