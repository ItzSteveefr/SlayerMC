const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'kick',
    async execute(interaction) {
        new ButtonBuilder()
            .setCustomId('kick')
            .setLabel('Kick')
            .setEmoji('🔨')
            .setStyle(ButtonStyle.Danger);
    }
};
