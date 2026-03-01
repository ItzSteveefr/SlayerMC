const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: '5',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('5')
            .setLabel('TO 1 Week')
            .setEmoji('⛔')
            .setStyle(ButtonStyle.Danger);
    }
};
