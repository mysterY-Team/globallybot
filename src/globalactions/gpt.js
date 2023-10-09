const { EmbedBuilder } = require("discord.js") // Embed discordowy, to można pominąć
const { get, ref, getDatabase, set } = require("@firebase/database")
const { firebaseApp } = require("../config")
const axios = require("axios")

module.exports = {
    data: {
        name: "ChatGPT",
        description:
            "Specjalnie wyszkolona do GlobalChata potężna sztuczna inteligencja od [OpenAI](https://openai.com/).\nJako, że jest to z zewnętrznego API, można użyć **raz na dzień**",
        avatar: "https://capiche.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbU5GIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2828502fa3c2cd9130a2a1df1d35ba7b0f9270c1/openai-avatar.png",
    },
    execute: async function (msg) {
        var data = await get(ref(getDatabase(firebaseApp), "globalchat/gpt"))

        if (data.val().uses.i < 10) {
            const options = {
                method: "GET",
                url: "https://chat-gpt-ai-bot.p.rapidapi.com/GenerateAIWritter",
                params: {
                    prompt: `[ Odpowiadasz jako ChatGPT wbudowany w GlobalChat wiadomość na górze jest najstarsza, a na dole - świeża, czytaj te wyższe, jeżeli są Ci potrzebne. Odpowiadasz normalnie bez prefixu. Możesz użyć formatowania Discord. Pamiętaj, aby odpowiedź miała mniej niż 1000 znaków ]\n\n${data
                        .val()
                        .messages.join("\n")}`,
                },
                headers: {
                    "X-RapidAPI-Key": "2ddf7ebb02msh1a346334811da70p11ad63jsn3982f775ddfd",
                    "X-RapidAPI-Host": "chat-gpt-ai-bot.p.rapidapi.com",
                },
            }

            const response = await axios.request(options)

            await set(ref(getDatabase(firebaseApp), "globalchat/gpt/uses/i"), data.val().uses.i + 1)
            return { content: response.data } //content = wiadomość
        } else {
            var embedReached = new EmbedBuilder().setColor("Orange").setDescription(`${customEmoticons.denided} Wybacz, ale jedynie mogę odpowiadać 10 razy na dzień!`)

            return { content: "", embeds: [embedReached] }
        }
    },
}
