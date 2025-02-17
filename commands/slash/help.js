const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all slash commands and their descriptions')
        .addStringOption(option =>
            option.setName('category')
            .setDescription('Type in the name of a different category to see its commands.')
            .setRequired(false)
            .addChoices(
                { name: 'Slash', value: 'slash' },
                { name: 'Auto Reply', value: 'auto reply' }
            )),
            
    async execute(client, interaction) {

        category = interaction.options.getString('category');

        //CATEGORY HELP
        const categoryEmbed = new EmbedBuilder()
            .setColor("#039799")
            .setTitle('Category Help')
            .setDescription('Use `/help` with the name of a category to see its commands (slash and auto reply).')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setThumbnail(client.user.avatarURL())
            .setFooter({text: 'Made by JustBeChill'})
            .addFields(
                { name: 'Slash', value: 'Slash commands are integrated with dicord using the `/` prefix.', inline: false },
                { name: 'Auto Reply', value: 'Auto reply commands are triggered by a specific message or word without a prefix.', inline: false }
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
            commandEmbed.setDescription('Slash commands are integrated with dicord and activated using the `/` prefix.');
            folder = 'slash';
        } else if(category == 'auto reply' || category == 'autoreply' || category == 'auto-reply') {
            commandEmbed.setTitle('Auto Reply Commands');
            commandEmbed.setDescription('Auto reply commands are triggered by a specific message or word without a prefix.');
            folder = 'auto-reply';
        }  else {
            await interaction.reply({ embeds: [categoryEmbed] });
            return;
        }

        //Add all commands in the specified folder to the embed
        client.commands.forEach(command => {
            if(command.folder == folder) commandEmbed.addFields({ name: command.data.name, value: command.data.description, inline: false })
        });

        await interaction.reply({ embeds: [commandEmbed] });
    }
}
