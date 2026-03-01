const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: '3',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('3')
            .setLabel('TO 1 Hour')
            .setEmoji('⛔')
            .setStyle(ButtonStyle.Danger);
    }
};
