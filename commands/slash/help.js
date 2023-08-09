const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all slash commands and their descriptions')
        .addStringOption(option =>
            option.setName('category')
            .setDescription('Type in the name of a different category to see its commands (slash, auto reply, and voice)')
            .setRequired(false)),
            
    async execute(client, interaction) {

        category = interaction.options.getString('category');

        //CATEGORY HELP
        const categoryEmbed = new EmbedBuilder()
            .setColor("#039799")
            .setTitle('Category Help')
            .setDescription('Use `/help` with the name of a category to see its commands (slash, auto reply, and voice).')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setThumbnail(client.user.avatarURL())
            .setFooter({text: 'Made by JustBeChill'})
            .addFields(
                { name: 'Slash', value: 'Slash commands are integrated with dicord using the `/` prefix.', inline: false },
                { name: 'Auto Reply', value: 'Auto reply commands are triggered by a specific message or word without a prefix.', inline: false },
                { name: 'Voice', value: 'Voice commands are triggered by a specific word or phrase during a voice call.', inline: false }
            )

        //COMMAND HELP TEMPLATE
        const commandEmbed = new EmbedBuilder()
            .setColor("#039799")
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setThumbnail(client.user.avatarURL())
            .setFooter({text: 'Made by JustBeChill'})


        //Set specified category
        if(category == 'slash') {
            commandEmbed.setTitle('Slash Commands');
            commandEmbed.setDescription('Slash commands are integrated with dicord using the `/` prefix.');
            folder = 'slash';
        } else if(category == 'auto reply') {
            commandEmbed.setTitle('Auto Reply Commands');
            commandEmbed.setDescription('Auto reply commands are triggered by a specific message or word without a prefix.');
            folder = 'auto-reply';
        } else if(category == 'voice') {
            commandEmbed.setTitle('Voice Commands');
            commandEmbed.setDescription('Voice commands are triggered by a specific word or phrase during a voice call.');
            folder = 'voice';
        } else {
            await interaction.reply({ embeds: [categoryEmbed] });
            return;
        }

        //Add all commands in the specified folder to the embed
        for (const command of client.commands) {
            if(command[1].folder == folder) commandEmbed.addFields({ name: command[1].data.name, value: command[1].data.description, inline: false })
        } 

        await interaction.reply({ embeds: [commandEmbed] });
    }
}
