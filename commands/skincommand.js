const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcskin')
        .setDescription('Get a player\'s Minecraft skin.')
        .addStringOption(o => o.setName('user').setDescription('The username of the player you want the avatar of.').setRequired(true)), 
    async execute(interaction) {

        const username = interaction.options.getString('user');
        const embed = new EmbedBuilder()
            .setTitle(`${username}'s Minecraft Skin`)
            .setImage(`https://minotar.net/body/${username}/100.png`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
