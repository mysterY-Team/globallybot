const { SlashCommandBuilder, ContextMenuCommandBuilder } = require("@discordjs/builders")
const { ChannelType, ApplicationCommandType, PermissionsBitField, InteractionContextType, ApplicationIntegrationType } = require("discord.js")
const fs = require("fs")

var slashList = [
    //globalchat
    new SlashCommandBuilder()
        .setName("globalchat")
        .setDescription("Komendy dotyczące GlobalChata")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
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
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("flaga")
                        .setDescription("Zmienia konfigurację kanału GlobalChat")
                        .addChannelOption((option) =>
                            option.setName("kanał").setDescription("Kanał, na którym się znajduje GlobalChat").setRequired(true).addChannelTypes(ChannelType.GuildText)
                        )
                        .addStringOption((options) => options.setName("flaga").setDescription("Nazwa flagi").setRequired(true))
                        .addStringOption((options) => options.setName("wartość").setDescription("Wartość ustawiana do flagi").setRequired(true))
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
        .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel, InteractionContextType.BotDM)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
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

    new SlashCommandBuilder()
        .setName("utils")
        .setDescription("Komendy 4fun")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
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
        ),

    //4fun
    new SlashCommandBuilder()
        .setName("4fun")
        .setDescription("Komendy 4fun")
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
        //jakieś błache

        .addSubcommand((subcommand) =>
            subcommand
                .setName("hakuj")
                .setDescription("Hakuje wybranego użytkownika")
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby ze serwera").setRequired(true))
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
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
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
        .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
        .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby")),
    new SlashCommandBuilder()
        .setName("imacarrrd")
        .setDescription("Karty użytkownika na nowym poziomie")
        .setContexts(InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
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
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("clear")
                .setDescription("Czyści daną ilość wiadomości")
                .addIntegerOption((option) => option.setName("ilość").setDescription("Ilość wiadomości do usunięcia").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("ban")
                .setDescription("Banuje osobę ze serwera")
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby ze serwera").setRequired(true))
                .addStringOption((option) => option.setName("powód").setDescription("Powód bana").setRequired(false))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("kick")
                .setDescription("Wyrzuca osobę ze serwera")
                .addUserOption((option) => option.setName("osoba").setDescription("@wzmianka lub ID osoby ze serwera").setRequired(true))
                .addStringOption((option) => option.setName("powód").setDescription("Powód kicka").setRequired(false))
        ),
    /*.addSubcommand((subcommand) =>
        subcommand
            .setName("stwórzrole")
            .setDescription("Tworzy role na serwerze")
            .addStringOption((option) => option.setName("nazwa").setDescription("Nazwa roli").setRequired(true))
            .addStringOption((option) => option.setName("kolor").setDescription("Kolor roli").setRequired(false))
            .addStringOption((option) => option.setName("ikona").setDescription("Podaj URL ikony roli").setRequired(false))
    ),*/

    //pojedyncze komendy
    new SlashCommandBuilder()
        .setName("dowcip")
        .setDescription("Generuje dowcip ze strony PERELKI.NET")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall),
    new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Generuje informacje o bocie")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
    new SlashCommandBuilder()
        .setName("mem")
        .setDescription("Generuje mema ze serwera MEMHUB")
        .setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall),
]

var contextList = [
    new ContextMenuCommandBuilder()
        .setContexts(InteractionContextType.Guild)
        .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
        .setType(ApplicationCommandType.Message)
        .setName("Pokaż przyciski GlobalChat"),
]
//console.log(slashList)

module.exports = {
    list: () => {
        return Array().concat(slashList, contextList)
    },
}
