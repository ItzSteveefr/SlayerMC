const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customID: 'Verify',
    async execute(interaction) {
        const verifyButton = new ButtonBuilder()
        .setCustomId("Verify")
        .setLabel("✅ Verify")
        .setStyle(ButtonStyle.Success);
    }
};