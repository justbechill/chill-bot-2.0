const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Repeats whatever you say')
        .addStringOption(option => 
            option.setName('message')
            .setDescription('The message to repeat')
            .setRequired(true)),
    async execute(client, interaction) {

        await interaction.reply({
            content: 'Test',
            ephemeral: true
        })

        let message = interaction.options.getString('message')

        if(message.includes('@everyone') || message.content.includes('@here')) {
            message = `${interaction.member} tried to ping everyone. Asshole.`
        }
        interaction.channel.send(message);
    }
}