const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const suggestion = require('../schemas/suggestionsystemschema');
const formatResults = require('../utils/formatresults');

module.exports = {
    owner: true,
    data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Configure the suggestion system.')
    .addSubcommand(command => command.setName('setup').setDescription('Setup a suggestion system.'))
    .addSubcommand(command => command.setName('disable').setDescription('Disable an already-existed suggestion channel.'))
    .addSubcommand(command => command.setName('submit').setDescription('Submit a suggestion.').addStringOption(option => option.setName('suggestion').setDescription('Input a suggestion.').setRequired(true))),
    async execute (interaction) {

    const { options } = interaction;
    const sub = options.getSubcommand();
    const Data = await suggestion.findOne({ GuildID: interaction.guild.id });
    const suggestmsg = options.getString('suggestion')

        switch (sub) {
            case 'setup':

            if (Data) {
                return await interaction.reply({ content: `You already have a suggestion system **setup**!`, ephemeral: true });
            } else {

                await suggestion.create({
                    GuildID: interaction.guild.id,
                })
                
                const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`})
                .setTitle('Success!')
                .setDescription(`<:50121checkmark:1278745788935045220>・The suggestion system has been successfully **setup**!`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'disable':

            if (!Data) {
                return await interaction.reply({ content: `You don't a suggestion system **setup**!`, ephemeral: true });
            } else {

                await suggestion.deleteMany({
                    GuildID: interaction.guild.id
                });

                const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`})
                .setTitle('Success!')
                .setDescription(`<:50121checkmark:1278745788935045220>・The suggestion system has been successfully **disable**!`)

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            break;
            case 'submit':

            if (!Data) {
                return await interaction.reply({ content: `You don't have a suggestion system **setup**!`, ephemeral: true });
            } else {

                const num1 = Math.floor(Math.random() * 256);
                const num2 = Math.floor(Math.random() * 256);
                const num3 = Math.floor(Math.random() * 256);
                const num4 = Math.floor(Math.random() * 256);
                const num5 = Math.floor(Math.random() * 256);
                const num6 = Math.floor(Math.random() * 256);
                const SuggestionID = `${num1}${num2}${num3}${num4}${num5}${num6}`;
        
                const suggestionembed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.guild.name}'s Suggestion System`, iconURL: interaction.guild.iconURL({ size: 256 })})
                .setColor('Blurple')
                .setTitle(`Suggestion from ${interaction.user.username}`)
                .setDescription(`> \`${suggestmsg}\``)
                .setTimestamp()
                .setFooter({ text: `Suggestion from ${interaction.user.username}`})
                .addFields({ name: 'Upvotes', value: '**No votes**', inline: true})
                .addFields({ name: 'Downvotes', value: '**No votes**', inline: true})
                .addFields({ name: `Votes`, value: formatResults() })
                .addFields({ name: 'Author', value: `> ${interaction.user}`, inline: false})
        
                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('upv')
                    .setEmoji('<:tup:1162598259626352652>')
                    .setLabel('Upvote')
                    .setStyle(ButtonStyle.Primary),
        
                    new ButtonBuilder()
                    .setCustomId('downv')
                    .setEmoji('<:tdown:1162598331390889994>')
                    .setLabel('Downvote')
                    .setStyle(ButtonStyle.Primary),
        
                    new ButtonBuilder()
                    .setCustomId('totalvotes')
                    .setEmoji('💭')
                    .setLabel('Votes')
                    .setStyle(ButtonStyle.Secondary)
                )
        
                const button2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('appr')
                    .setEmoji('<a:AUSC_checked:1011088709266985110>')
                    .setLabel('Approve')
                    .setStyle(ButtonStyle.Success),
        
                    new ButtonBuilder()
                    .setCustomId('rej')
                    .setEmoji('<a:rejected:1162622460835922043>')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
                )

                await interaction.reply({ content: `Your suggestion has been submitted!`, ephemeral: true });
                const msg = await interaction.channel.send({ content: `${interaction.user}'s Suggestion`, embeds: [suggestionembed], components: [button, button2] });
                msg.createMessageComponentCollector();

                await suggestion.create({
                    GuildID: interaction.guild.id,
                    Msg: msg.id,
                    AuthorID: interaction.user.id,
                    upvotes: 0,
                    downvotes: 0,
                    Upmembers: [],
                    Downmembers: []
                })
            }
        }
    }
}