const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

let cachedStatus = null;
const statusUpdateInterval = 60000; // 1 minute in milliseconds

// Function to fetch and update the server status
async function updateServerStatus(ip) {
  const url = `https://api.mcsrvstat.us/1/${ip}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Update cached status
    cachedStatus = data;

    console.log('Updated server status:', cachedStatus);
  } catch (error) {
    console.error('Error fetching server status:', error);
  }
}

// Command to retrieve server status
module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcstatus')
    .setDescription('Retrieve the status of a Minecraft server.')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('The IP address of the Minecraft server.')
        .setRequired(true)
    )
    .addBooleanOption(option =>
      option.setName('detailed')
        .setDescription('Whether to show detailed server information.')
        .setRequired(false)
    ),
  
  async execute(client, interaction) {
    await interaction.deferReply();

    const ip = interaction.options.getString('ip');
    const detailed = interaction.options.getBoolean('detailed') || false;

    if (!cachedStatus || cachedStatus.ip !== ip) {
      await updateServerStatus(ip);
    }

    const data = cachedStatus;

    // Error embed
    const errorEmbed = new EmbedBuilder()
      .setColor('#FF0000') // Red color for errors
      .setTitle('Error: Unable to Retrieve Server Status')
      .setDescription(
        'There was an issue accessing the server information. Possible reasons include:\n' +
        '- The server might be offline\n' +
        '- The IP address might be incorrect or misformatted\n' +
        '- The server may be using a non-standard API or is incompatible\n' +
        'Please verify the IP address and try again.'
      )
      .setFooter({ text: 'If the issue persists, please contact support.' })
      .setTimestamp();

    if (!data || data.error) {
      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
      return;
    }

    // Handle server data with default values
    const serverip = String(data.hostname || 'N/A');
    const realip = String(data.ip || 'N/A');
    const version = String(data.version || 'N/A');
    const onlinePlayers = String(data.players?.online ?? 'N/A');
    const maxPlayers = String(data.players?.max ?? 'N/A');
    const motd = data.motd?.clean?.join('\n') || 'N/A';
    const playersList = data.players?.list ? data.players.list.join('\n') : 'N/A';
    const serverType = String(data.software || 'N/A'); // Corrected to match typical field name

    // Check whitelist status
    let hasWhitelist = 'Unknown';
    if (typeof data.whitelist === 'boolean') {
      hasWhitelist = data.whitelist ? 'Yes' : 'No';
    } else if (typeof data.whitelist === 'string') {
      if (data.whitelist.toLowerCase() === 'true') {
        hasWhitelist = 'Yes';
      } else if (data.whitelist.toLowerCase() === 'false') {
        hasWhitelist = 'No';
      }
    }

    const isOnline = onlinePlayers !== 'N/A' && parseInt(onlinePlayers) > 0;

    // Create the embed based on the detailed flag
    const embed = new EmbedBuilder()
      .setColor(isOnline ? '#00FF00' : '#FF0000') // Green if online, red if offline
      .setTitle(`Minecraft Server Status for ${serverip}`)
      .setDescription(isOnline ? 'The server is currently online!' : 'The server appears to be offline.')
      .addFields(
        { name: 'IP Address', value: realip, inline: true },
        { name: 'Version', value: version, inline: true },
        { name: 'MOTD', value: motd, inline: false }
      );

    if (detailed) {
      embed.addFields(
        { name: 'Online Players', value: onlinePlayers, inline: true },
        { name: 'Max Players', value: maxPlayers, inline: true },
        { name: 'Server Type', value: serverType, inline: true },
        { name: 'Whitelist Enabled', value: hasWhitelist, inline: true },
        { name: 'Player List', value: playersList, inline: false }
      );
    }

    embed.setFooter({ text: 'Data provided by mcsrvstat.us' })
         .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

// Update the status periodically
const serverIp = 'slayer.sparked.network'; // Replace with your default server IP
setInterval(() => {
  updateServerStatus(serverIp);
}, statusUpdateInterval);
