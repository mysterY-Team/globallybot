const { SlashCommandBuilder } = require("@discordjs/builders")
const { CommandInteraction, Client, EmbedBuilder } = require("discord.js")
const { getDatabase, ref, set, get } = require("@firebase/database")
const { firebaseApp, ownersID, customEmoticons } = require("./config")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("godblokuj")
        .setDescription("Dodaje osoby do czarnej listy GlobalChata.")
        .addStringOption((option) =>
            option
                .setName("osoba")
                .setDescription("ID osoby do zablokowania.")
                .setRequired(true),
        ),
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (!ownersID.includes(interaction.user.id))
            //zwraca informację widoczną tylko dla niego za pomocą interaction.reply(), że nie ma odpowiednich permisji.
            return interaction.reply({
                ephemeral: true,
                content: `${customEmoticons.denided} Nie możesz wykonać tej funkcji! Możliwe powody:
                    - Nie jesteś na liście developerów bota`,
            })
        try {
            get(ref(getDatabase(firebaseApp), "globalchat/userblocks")).then(
                (snapshot) => {
                    blockList = snapshot.val()

                    if (
                        !blockList.includes(
                            interaction.options.get("osoba", true).value,
                        )
                    ) {
                        interaction.reply({
                            content: `${customEmoticons.denided} Ta osoba nie jest zablokowana!`,
                            ephemeral: true,
                        })
                        return
                    }

                    blockList[
                        blockList.indexOf(
                            interaction.options.get("osoba", true).value,
                        )
                    ] = null
                    const embedblock = new EmbedBuilder()
                        .setTitle("Zostałeś odblokowany!")
                        .setDescription(
                            `Od teraz będziesz miał dostęp do GlobalChata, dopóki znów nie będziesz zablokowany!`,
                        )
                        .setColor("Green")
                        .setFields({
                            name: "Odblokowany przez",
                            value: `${(interaction.user.discriminator = "0"
                                ? interaction.user.username
                                : `${interaction.user.username}#${interaction.user.discriminator}`)}`,
                        })

                    client.users.send(
                        interaction.options.get("osoba", true).value,
                        {
                            embeds: [embedblock],
                        },
                    )

                    interaction.reply({
                        content: `${
                            customEmoticons.approved
                        } Pomyślnie zablokowano użytkownika <@${
                            interaction.options.get("osoba", true).value
                        }> \`${interaction.options.get("osoba", true).value}\``,
                        ephemeral: true,
                    })
                    set(
                        ref(getDatabase(firebaseApp), "globalchat/userblocks"),
                        blockList,
                    )
                },
            )
        } catch (err) {
            console.error(err)
        }
    },
}
