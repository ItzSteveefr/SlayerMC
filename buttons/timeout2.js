const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: '2',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('2')
            .setLabel('TO 10 Minutes')
            .setEmoji('⛔')
            .setStyle(ButtonStyle.Danger);
    }
};
