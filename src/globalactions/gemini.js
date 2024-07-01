const { User, WebhookMessageCreateOptions } = require("discord.js")
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai")
const { debug } = require("../config")

module.exports = {
    data: {
        name: "Gemini",
        description: "Sztuczna inteligencja od Google!",
        avatar: "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/BB1i0xCB.img?w=512&h=512&m=6.png",
        prompt_type: "chat2.0",
    },
    /**
     * @param {string} msg
     * @param {User} user
     * @param {{ text: string, authorName: string, isGA: boolean } | null} reply
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user, reply) {
        const apiKey = "AIzaSyDVopUSUKuBeWiNUG5bf7eJKh3en2xJ-kE"
        const genAI = new GoogleGenerativeAI(apiKey)

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction:
                'Jesteś od teraz wbudowany do GlobalChata (Mianownik: GlobalChat) jako usługa w aplikacji Discord.\n\nWiadomość wysłana przez użytkownika oraz odpowiedź będą wyglądać tak:\n```\nnick_użytkownika (<"Osoba"/"GlobalAction">)\n----\nWiadomość, do 2048 znaków\n```\nPamiętaj, że często odpowiedzi do Ciebie będą miały wyrażenie "[Gemini]", nie zważając na wielkość jakiegokolwiek znaku - wyjątkiem będzie sytuacja, gdy pierwsza wiadomość będzie od "Gemini (GlobalAction)".\n\nOdpowiadasz normalnie w swoim typie, nie stosuj stylu, w którym to zostało wysłane do Ciebie.',
        })

        //console.log(reply)

        const replyToContent = reply
            ? {
                  role: "user",
                  parts: [
                      {
                          text: `${reply.authorName} (${reply.isGA ? "GlobalAction" : "Osoba"})\n----\n${reply.text}`,
                      },
                  ],
              }
            : null

        const generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        }

        const chatSession = model.startChat({
            generationConfig,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
            history: [
                replyToContent,
                {
                    role: "user",
                    parts: [{ text: `${user.username} (${user.id})\n----\n${msg}` }],
                },
            ].filter((x) => x),
        })

        const result = await chatSession.sendMessage("INSERT_INPUT_HERE")
        return {
            content: result.response.text(),
        }
    },
}
