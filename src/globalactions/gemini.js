import djs from "discord.js"
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai"
import conf from "../config.js"
const { othertokens } = conf

export default {
    data: {
        name: "Gemini",
        description:
            "Sztuczna inteligencja, która pomoże Ci rozwijać pomysły. Pobudź swoją kreatywność i zwiększ produktywność!\n*Warto zapoznać się z [prywatnością i warunkami](https://policies.google.com/) usługi Google*",
        avatar: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1i0xCB.img?w=512&h=512&m=6.png",
        prompt_type: "chat2.0",
    },
    execute: async function (msg, user, reply) {
        const apiKey = othertokens.gemini
        const genAI = new GoogleGenAI({ apiKey })

        //console.log(reply)
        const replyToContent = reply ? `${reply.author.name} (${reply.isGA ? "GlobalAction" : `osoba, ID: ${reply.author.id}`})\n----\n${reply.text}` : null

        const result = await genAI.models.generateContent({
            model: "gemini-2.0-flash",
            config: {
                temperature: 0.75,
                topP: 1,
                topK: 64,
                maxOutputTokens: 500,
                responseMimeType: "text/plain",
                tools: [{ googleSearch: {} }],
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
            ],
            contents: [replyToContent, `${user.username} (${user.id})\n----\n${msg}`].filter((x) => x),
        })

        console.log(result.candidates?.[0]?.groundingMetadata?.groundingChunks)

        // get the web url from the result
        var webs = result.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []

        return {
            content: result.text,
            embeds:
                webs.length > 0
                    ? [
                          new djs.EmbedBuilder()
                              .setAuthor({ name: "Źródła wyszukiwania", iconURL: "https://cdn.freebiesupply.com/logos/large/2x/google-icon-logo-png-transparent.png" })
                              .setDescription(webs.map(({ web }) => `[🌐 ${web.title}](${web.uri})`).join("\n"))
                              .setColor(["#4285F4", "#EA4335", "#FBBC05", "#34A853"][Math.floor(Math.random() * 4)]),
                      ]
                    : [],
        }
    },
}
