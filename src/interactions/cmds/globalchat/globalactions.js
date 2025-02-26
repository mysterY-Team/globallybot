import conf from "../../../config.js"
const { customEmoticons } = conf
import djs from "discord.js"
const { ChatInputCommandInteraction, Client, EmbedBuilder } = djs

export default {
    /**
     *
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        var ga = interaction.options.get("globalaction")?.value

        if (!ga) {
            var embed = new EmbedBuilder()
                .setTitle(`${customEmoticons.info} Korzystanie z GlobalActions`)
                .setDescription(
                    "GlobalActions są to akcje dostępne do korzystania w GlobalChacie. Dzięki temu możesz urozmaicić usługę ciekawymi rzeczami!\nUżycie może być różne, w zależności od danego GA"
                )
                .addFields(
                    {
                        name: "Q: Gdzie mogę sprawdzić listę akcji?",
                        value: "**A:** Podczas korzystania z argumentu *`globalaction`*. Ma do wyboru wszystkie akcje dostępne do GlobalChat.",
                    },
                    { name: "Q: Posiadają jakieś ograniczenia?", value: "**A:** Nie wszystkie - w razie ograniczeń w opisie będzie wzmianka na ten temat." },
                    {
                        name: "Q: Czy mogę przekształcać nazwę wywoławczą?",
                        value: "**A:** Ułatwienie jest takie, że nazwę wywoławczą możesz pisać małymi, wielkimi lub mieszanką małych i dużych liter, aczkolwiek literówek jeszcze nie przyjmuje.",
                    }
                )
                .setColor("Random")
        } else {
            var file = (await import(`../../../globalactions/${ga}.js`)).default
            var use

            if (file.data.prompt_type == "cmd") use = "```{nazwa_wywoławcza}!<komenda>```"
            if (file.data.prompt_type == "chat") use = "```{nazwa_wywoławcza}, <polecenie>```"
            if (file.data.prompt_type == "chat2.0") use = "Wystarczy użyć w kwadratowe nawiasy nazwę wywoławczą (tutaj: `[{nazwa_wywoławcza}]`) lub odpowiedzieć na jego wiadomość"

            var embed = new EmbedBuilder()
                .setTitle(`${file.data.name}`)
                .setThumbnail(file.data.avatar)
                .setDescription(file.data.description)
                .addFields({ name: "Nazwa wywoławcza", value: `\`${ga}\`` }, { name: "Użycie", value: use.replace("{nazwa_wywoławcza}", ga) })
                .setColor("Random")
        }

        return interaction.reply({
            embeds: [embed],
        })
    },
}
