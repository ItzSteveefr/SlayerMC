const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: '4',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('4')
            .setLabel('TO 1 Day')
            .setEmoji('⛔')
            .setStyle(ButtonStyle.Danger);
    }
};
