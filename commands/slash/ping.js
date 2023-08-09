const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong and latency'),
    async execute(client, interaction) {
        await interaction.reply('Pong!  `' + client.ws.ping + ' ms`');
    }
}