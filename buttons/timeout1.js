const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: '1',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('1')
            .setLabel('TO 5 Minutes')
            .setEmoji('⛔')
            .setStyle(ButtonStyle.Danger);
    }
};
