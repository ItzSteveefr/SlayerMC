const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
  } = require("discord.js");
  
  module.exports = {
    dev: true,
    data: new SlashCommandBuilder()
      .setName("verify-setup")
      .setDescription("Setup the verify command")
      .addRoleOption(option =>
        option.setName('role')
          .setDescription(`The role you want to add after the user is verified`)
          .setRequired(true)
      )
      .addChannelOption(option =>
        option.setName('channel')
          .setDescription(`The channel you want to send the verification embed to`)
          .setRequired(true)
      ),
    async execute(interaction, client) {
      NoPermEmbed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(
        `⚠️ This command is only accessible by the Authorized users!`
      );
    if (
      interaction.user.id !== '997689430993272852' &&
      interaction.user.id !== '889426201159016479' &&
      interaction.user.id !== '1026499245014011944' &&
      interaction.user.id !== '730001967518056588' &&
      interaction.user.id !== '' &&
      interaction.user.id !== ''
    )
      return await interaction.reply({
        embeds: [NoPermEmbed],
        ephemeral: true,
      });
      const role = interaction.options.getRole('role');
      const channel = interaction.options.getChannel('channel');
      const author = interaction.user;
  
      const verifyButton = new ButtonBuilder()
        .setCustomId("Verify")
        .setLabel("✅ Verify")
        .setStyle(ButtonStyle.Success);
  
      const row = new ActionRowBuilder()
        .addComponents(verifyButton);
  
      const verifyembed = {
        color: 5763718,
        title: '• Verification Message',
        description: '> Click the button below to verify!',
        author: {
            name: '✅ Verification Process'
          },
          footer: {
            text: `✅ Verification Prompt • Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          },
        thumbnail: {
            url: 'https://cdn.discordapp.com/attachments/1200713640710524961/1265052544690815108/DClogo.png?ex=66d03a3e&is=66cee8be&hm=9af9e601539fc47925d286b89e08c9618295567b1d2b9f59db167cb2f4982bc0&'
          }
      };
  
      const empembed = {
        color: 5763718,
        title: "Verification Enabled",
        description: `**You have now enabled verification on your server!**`,
      };
  
      const verifiedembed = {
        color: 5763718,
        title: "Verified!",
        description: `**You have now verified and received your role! \n check out all the channels now.**`,
        timestamp: new Date(),
      };
  
      await interaction.reply({
        embeds: [empembed],
        ephemeral: true,
      });
  
      const msg = await channel.send({
        embeds: [verifyembed],
        components: [row],
      });
  
      const collector = msg.createMessageComponentCollector();
  
      collector.on("collect", async (i) => {
        try {
          if (i.customId === "Verify") {
            await i.reply({ embeds: [verifiedembed], ephemeral: true });
            await i.member.roles.add(role);
          }
        } catch (error) {
          console.error('Failed to verify user:', error);
  
          const errorEmbed = {
            color: 'Red',
            timestamp: new Date(),
            title: 'Error',
            description: `Error during verification`
          };
  
          await i.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      });
    }
  };
  