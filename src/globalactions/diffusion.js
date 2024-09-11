const { User, WebhookMessageCreateOptions, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { request } = require("undici")

module.exports = {
    data: {
        name: "Stable Diffusion",
        description:
            'Twoje najlepsze AI do generowania zdjęć. Dosłownie!\n*Warto zapoznać się z ["Terms and Conditions" Stable Diffusion API](https://stablediffusionapi.com/p/Terms-and-Conditions/)*',
        avatar: "https://assets.modelslab.ai/themes/October2022/Kh4QdnAqdueh6PeJpCQD.png",
        prompt_type: "chat",
    },
    /**
     * @param {string} msg
     * @param {User} user
     * @param {{ text: string, author: { name: string, id: string }, isGA: boolean }| null} reply
     * @returns {Promise<WebhookMessageCreateOptions>}
     */
    execute: async function (msg, user, reply) {
        var myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")

        const response = await request("https://stablediffusionapi.com/api/v3/text2img", {
            headers: myHeaders,
            method: "POST",
            body: JSON.stringify({
                key: othertokens.stable_diff,
                prompt: msg,
                negative_prompt:
                    "extra fingers, mutated hands, poorly drawn hands, deformed, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, distorted face",
                width: "512",
                height: "512",
                samples: "1",
                num_inference_steps: "20",
                seed: null,
                guidance_scale: 7.5,
                webhook: null,
                track_id: null,
            }),
        })

        const data = await response.body.json()
        // Sprawdź, czy odpowiedź zawiera dane obrazu
        if (data && data.output && data.output.length > 0) {
            const imageUrl = data.output[0]
            return {
                content: "Wygenerowano zdjęcie!",
                files: [new AttachmentBuilder().setFile(imageUrl, "file.png")],
                components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(imageUrl).setLabel("Zdjęcie online"))],
            }
        } else {
            throw console.error("No image generated:", data)
        }
    },
}
