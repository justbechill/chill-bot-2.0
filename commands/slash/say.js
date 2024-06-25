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

        let message = interaction.options.getString('message')

        if(message.includes('@everyone') || message.includes('@here')) {
            message = `${interaction.member} tried to ping everyone. Asshole.`
        }
        interaction.channel.send(message);

        await interaction.reply({
            content: 'I cant just not reply to a message, so this is here :(',
            ephemeral: true
        })
    }
}