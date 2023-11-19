const { EmbedBuilder, User, WebhookMessageCreateOptions, resolvePartialEmoji } = require("discord.js") // Embed discordowy, to można pominąć
const { get, ref, getDatabase, set } = require("@firebase/database")
const { firebaseApp } = require("../config")
const axios = require("axios")

module.exports = {
    data: {
        name: "ChatGPT",
        description:
            "Specjalnie wyszkolona do GlobalChata potężna sztuczna inteligencja od [OpenAI](https://openai.com/).\n*Jako, że jest to z zewnętrznego API, można użyć **10 razy na dzień***",
        avatar: "https://nileswestnews.org/wp-content/uploads/2023/01/chatgptlogo.png",
        prompt_type: "chat2.0",
    },
    /**
     * @param {string} msg
     * @param {User} user
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user) {
        var data = await get(ref(getDatabase(firebaseApp), "globalchat/gpt"))

        if (data.val().uses < 10) {
            const options = {
                method: "POST",
                url: "https://chatgpt-api8.p.rapidapi.com/",
                headers: {
                    "content-type": "application/json",
                    "X-RapidAPI-Key": "2ddf7ebb02msh1a346334811da70p11ad63jsn3982f775ddfd",
                    "X-RapidAPI-Host": "chatgpt-api8.p.rapidapi.com",
                },
                data: [
                    {
                        content: `Na tą wiadomość twoją rolą jest odpowiadanie jako akcja ChatGPT do GlobalChata należącego do bota Globally, więc masz prawo do formatowania używanego w Discordzie (wraz z nagłówkami).\nOstre nawiasy służą do oznaczania autora wiadomości. W akcjach osadzenia mogą być nie podane, więc oznacza, że nie ma. Ogólnie bądź sobą, wiadomość ma być taka jak zwykle. Dane wiadomości czytaj od dołu do góry - na samym dole jest najnowsza, dosłownie sprzed kilka chwil. Czytaj następne, jeżeli nie możesz wyłapać potrzebnych wiadomości. Stosuj się najlepiej do stylu wiadomości.\n\nA oto baza danych ostatnich wiadomości:\n\n${data
                            .val()
                            .messages.join("\n")}\n<ChatGPT (GlobalAction)> "..." (obsadzeń: 0)`,
                        role: "user",
                    },
                ],
            }

            const _response = await axios.request(options)
            var response = _response.data.text
            if (response.toLowerCase().startsWith("[gpt]")) response = response.slice(6)
            if (response.toLowerCase().startsWith("<chatgpt (globalaction)>")) {
                response = response.slice(26)
                if (response.toLowerCase().endsWith("(obsadzeń: 0)")) response = response.slice(0, 14)
                if (response.toLowerCase().endsWith("(plików: 0)")) response = response.slice(0, 12)
                response = response.trim()
                if (response.startsWith('"')) response = response.slice(1)
                if (response.endsWith('"')) response = response.slice(0, 1)
            }

            await set(ref(getDatabase(firebaseApp), "globalchat/gpt/uses"), data.val().uses + 1)
            return { content: response } //content = wiadomość
        } else {
            var embedReached = new EmbedBuilder().setColor("Orange").setDescription(`${customEmoticons.denided} Wybacz, ale jedynie mogę odpowiadać 10 razy na dzień!`)

            return { content: "", embeds: [embedReached] }
        }
    },
}
